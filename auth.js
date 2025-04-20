// Auth JavaScript for registration and login
document.addEventListener('DOMContentLoaded', function() {
  // Google Apps Script URL (replace with your deployed web app URL)
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzUROSKBMfKU2Ex2Mw2lAxunR9155MX4PkNVBfAKRB5_wyc__LlBb1KqMh7sIkuXHz07g/exec';
  
  // Registration form
  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const school = document.getElementById('school').value;
      const proof = document.getElementById('proof').value;
      
      const params = new URLSearchParams({
        action: 'register',
        name: name,
        email: email,
        phone: phone,
        school: school,
        proof: proof
      });
      
      fetch(scriptUrl, {
        method: 'POST',
        body: params
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const successModal = new bootstrap.Modal(document.getElementById('successModal'));
          document.getElementById('successMessage').textContent = data.message;
          successModal.show();
          document.getElementById('registerForm').reset();
        } else {
          const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
          document.getElementById('errorMessage').textContent = 'Registration Failed';
          document.getElementById('errorDetails').textContent = data.message;
          errorModal.show();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorMessage').textContent = 'Error';
        document.getElementById('errorDetails').textContent = 'Failed to submit registration. Please try again.';
        errorModal.show();
      });
    });
  }
  
  // Login form
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailOrPhone = document.getElementById('loginEmail').value;
      
      const params = new URLSearchParams({
        action: 'login',
        email: emailOrPhone,
        phone: emailOrPhone
      });
      
      fetch(`${scriptUrl}?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Successful login - redirect to home page
          const successModal = new bootstrap.Modal(document.getElementById('successModal'));
          successModal.show();
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 2000);
        } else {
          // Handle different error cases
          switch(data.status) {
            case 'not_found':
              const notFoundModal = new bootstrap.Modal(document.getElementById('notFoundModal'));
              notFoundModal.show();
              break;
            case 'pending':
              const pendingModal = new bootstrap.Modal(document.getElementById('pendingModal'));
              pendingModal.show();
              break;
            case 'expired':
              const expiredModal = new bootstrap.Modal(document.getElementById('expiredModal'));
              expiredModal.show();
              
              // Store user data for renewal
              document.getElementById('renewEmail').value = data.user.email;
              document.getElementById('renewPhone').value = data.user.phone;
              break;
            case 'declined':
              const declinedModal = new bootstrap.Modal(document.getElementById('declinedModal'));
              declinedModal.show();
              break;
            default:
              const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
              document.getElementById('errorMessage').textContent = 'Login Failed';
              document.getElementById('errorDetails').textContent = data.message;
              errorModal.show();
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorMessage').textContent = 'Error';
        document.getElementById('errorDetails').textContent = 'Failed to login. Please try again.';
        errorModal.show();
      });
    });
  }
  
  // Renew button in expired modal
  if (document.getElementById('renewBtn')) {
    document.getElementById('renewBtn').addEventListener('click', function() {
      const expiredModal = bootstrap.Modal.getInstance(document.getElementById('expiredModal'));
      expiredModal.hide();
      
      const renewalModal = new bootstrap.Modal(document.getElementById('renewalModal'));
      renewalModal.show();
    });
  }
  
  // Submit renewal form
  if (document.getElementById('submitRenewalBtn')) {
    document.getElementById('submitRenewalBtn').addEventListener('click', function() {
      const email = document.getElementById('renewEmail').value;
      const phone = document.getElementById('renewPhone').value;
      const proof = document.getElementById('renewProof').value;
      
      const params = new URLSearchParams({
        action: 'renew',
        email: email,
        phone: phone,
        proof: proof
      });
      
      fetch(scriptUrl, {
        method: 'POST',
        body: params
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const renewalModal = bootstrap.Modal.getInstance(document.getElementById('renewalModal'));
          renewalModal.hide();
          
          const successModal = new bootstrap.Modal(document.getElementById('successModal'));
          document.getElementById('successMessage').textContent = data.message;
          successModal.show();
        } else {
          const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
          document.getElementById('errorMessage').textContent = 'Renewal Failed';
          document.getElementById('errorDetails').textContent = data.message;
          errorModal.show();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        document.getElementById('errorMessage').textContent = 'Error';
        document.getElementById('errorDetails').textContent = 'Failed to submit renewal. Please try again.';
        errorModal.show();
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const nameSpan = document.getElementById('name');
  const loginSpan = document.getElementById('loginTimes');

  // Function to fetch the authenticated user's email
  async function fetchUserData() {
    try {
      const response = await fetch('/api/v1/profile/userdata');
      if (response.ok) {
        const data = await response.json();
        const name = data.username;
        const loginTimes = data.loginTimes;
        nameSpan.textContent = name;
        loginSpan.textContent = loginTimes;
      } else {
        // Handle error response here if needed
        console.log('Error fetching user data');
      }
    } catch (err) {
      // Handle fetch error here if needed
      console.log('Error fetching user data:', err);
    }
  }

  // Call the function to fetch and update the user's email
  fetchUserData();
});

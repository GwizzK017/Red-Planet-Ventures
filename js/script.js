const data = ['Mars Adventure', 'Neptunes Cosmic Dive', 'Saturn Rings Tour', 'Jupiter Flyby', 'Venus Cruise'];

  function handleSearch() {
    const query = document.querySelector('.form-control').value.toLowerCase();
    const results = data.filter(item => item.toLowerCase().includes(query));
    alert('Results: ' + (results.length ? results.join(', ') : 'No matches found'));
  }

  document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('.form-control');
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
      }
    });
  });
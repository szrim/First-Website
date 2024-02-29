const btn = document.getElementById('btn');
const tableBody = document.getElementById('tableBody');
const url = '/api/v1/groceries/items';
const stock = document.getElementById('stock');

btn.addEventListener('click', () => {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log('Error fetching data:');
      }
    })
    .then(data => {
      populateTable(data);
    })
    .catch(err => {
      console.log('Error fetching data:', err);
    });
});

function populateTable(data) {
  tableBody.innerHTML = ''; // Clear previous table content
  data.forEach(item => {
    const row = document.createElement('tr');
    const itemCell = document.createElement('td');
    itemCell.textContent = item.name;
    const stockCell = document.createElement('td');
    stockCell.textContent = item.quantity;

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to cart';
    addButton.addEventListener('click', addCart());

    row.appendChild(itemCell);
    row.appendChild(quantityCell);
    row.appendChild(addButton);
    tableBody.appendChild(row);
  });
};

function addCart(){
  fetch('/api/v1/groceries/item', {
    body: {
      
    }
  })
};


const grid = document.getElementById('countriesGrid');
const search = document.getElementById('search');
const themeBtn = document.getElementById('themeToggle');
const filterBtn = document.getElementById('filterBtn');
const filterMenu = document.getElementById('filterMenu');
const filterItems = document.querySelectorAll('.filter-menu li');

let countries = [];
let currentRegion = 'all';

async function fetchCountries() {
	try {
		const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags');
		countries = await res.json();
		render(countries);
	} catch (err) {
		grid.innerHTML = '<p>Ma’lumot yuklashda xatolik yuz berdi...</p>';
	}
}

function render(data) {
	grid.innerHTML = data
		.map(
			c => `
    <div class="card">
      <img src="${c.flags.png}" alt="${c.name.common}">
      <div class="card-body">
        <h3>${c.name.common}</h3>
        <p><b>Population:</b> ${c.population.toLocaleString()}</p>
        <p><b>Region:</b> ${c.region}</p>
        <p><b>Capital:</b> ${c.capital?.[0] || 'N/A'}</p>
      </div>
    </div>
  `
		)
		.join('');
}

function filterData() {
	const term = search.value.toLowerCase();

	const filtered = countries.filter(c => {
		const matchesSearch = c.name.common.toLowerCase().includes(term);
		const matchesRegion = currentRegion === 'all' || c.region === currentRegion;
		return matchesSearch && matchesRegion;
	});

	render(filtered);
}

search.addEventListener('input', filterData);

filterBtn.addEventListener('click', e => {
	e.stopPropagation();
	filterMenu.classList.toggle('show');
});

filterItems.forEach(item => {
	item.addEventListener('click', () => {
		currentRegion = item.getAttribute('data-region');
		filterBtn.querySelector('span').innerText = item.innerText;
		filterMenu.classList.remove('show');
		filterData();
	});
});

window.addEventListener('click', () => filterMenu.classList.remove('show'));

themeBtn.addEventListener('click', () => {
	document.body.classList.toggle('dark');
	const isDark = document.body.classList.contains('dark');
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	themeBtn.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

if (localStorage.getItem('theme') === 'dark') {
	document.body.classList.add('dark');
	themeBtn.innerHTML = '☀️ Light Mode';
}

fetchCountries();

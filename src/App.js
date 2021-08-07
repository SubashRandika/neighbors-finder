import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [randomCountries, setRandomCountries] = useState();

	useEffect(() => {
		const getRandom = async (array, number) => {
			const result = new Array(number);
			let len = array.length;
			const taken = new Array(len);

			if (number > len) {
				throw new RangeError('More elements going to take than available');
			}

			while (number--) {
				const random = Math.floor(Math.random() * len);
				result[number] = array[random in taken ? taken[random] : random];
				taken[random] = --len in taken ? taken[len] : len;
			}

			return result;
		};

		const fetchRandomCountries = async () => {
			const response = await fetch('https://travelbriefing.org/countries.json');
			const countries = await response.json();
			const tenRandomCountries = await getRandom(countries, 10);
			console.log(tenRandomCountries);
			setRandomCountries(tenRandomCountries);
		};

		fetchRandomCountries();
	}, []);

	return (
		<div>
			<h1 className='app-title'>Neighbors Finder</h1>
			<button className='btn-generate'>Generate Groupings</button>
		</div>
	);
}

export default App;

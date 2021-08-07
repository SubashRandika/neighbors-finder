import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [randomCountries, setRandomCountries] = useState([]);
	const [neighborGroups, setNeighborGroups] = useState([]);
	const [message, setMessage] = useState('');

	const fetchNeighbors = async (country) => {
		const response = await fetch(
			`https://travelbriefing.org/${country}?format=json`
		);

		const details = await response.json();

		return details;
	};

	async function handleFindNeighbors() {
		for (let country of randomCountries) {
			const { neighbors } = await fetchNeighbors(country.name);
			const currentNeighbors = neighbors.map((neighbor) => neighbor.name);
			const foundNeighbor = currentNeighbors.find((cn) =>
				randomCountries.includes(cn)
			);

			let neighborCouple;

			if (foundNeighbor) {
				neighborCouple = `${country} ${foundNeighbor}`;

				if (!neighborGroups.includes(neighborCouple)) {
					setNeighborGroups([...neighborGroups, neighborCouple]);
				}
			}
		}

		if (neighborGroups.length === 0) {
			setMessage('No Groupings found');
		} else {
			setMessage('Multiple mutual groupings found');
		}
	}

	useEffect(() => {
		// Generate random number of values from array
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

		// fetch all the countries and set 10 random countries to state
		const fetchRandomCountries = async () => {
			const response = await fetch('https://travelbriefing.org/countries.json');
			const countries = await response.json();
			const tenRandomCountries = await getRandom(countries, 10);
			setRandomCountries(tenRandomCountries);
		};

		fetchRandomCountries();
	}, []);

	return (
		<div>
			<h1 className='app-title'>Neighbors Finder</h1>
			<h2 className='app-message'>{message && message}</h2>
			<button className='btn-generate' onClick={handleFindNeighbors}>
				Generate Groupings
			</button>
			<h3 className='sub-title'>Selected Countries</h3>
			<ul>
				{randomCountries.length === 0
					? 'Loading...'
					: randomCountries.map((country, index) => (
							<li key={index}>{country?.name}</li>
					  ))}
			</ul>
			<h3 className='sub-title'>Neighbors</h3>
			{neighborGroups.length === 0
				? message
				: neighborGroups.map((group) => <p>{group}</p>)}
		</div>
	);
}

export default App;

module.exports = {
	env: '../.env',
	contracts: [
		{
			name: 'Greeter',
			deployArgs: 'Hi There!',
			env: {
				key: 'VITE_CONTRACT_ADDRESS',
				value: 'address'
			}
		}
	]
};

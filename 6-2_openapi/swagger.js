import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		title: 'Bibliothek API',
		description: 'Dokumentation der Bücher- und Ausleih-Endpunkte',
	},
	host: 'localhost:3000',
	basePath: '/',
	schemes: ['http'],
	tags: [
		{ name: 'Book', description: 'Alle Endpunkte für Bücher' },
		{ name: 'Lend', description: 'Alle Endpunkte für Ausleihen' },
	],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./bibliothek.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);

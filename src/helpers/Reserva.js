import firebase from 'firebase/app';

const crearReserva = (reserva) => {
	return new Promise((resolve, reject) => {
		const ref = firebase.database().ref().child('/reservas');
		const key = ref.push().key;
		ref.child(`/${key}`).set(reserva)
			.then((snap) => {
				resolve(key);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export {
	crearReserva
}
import 'firebase/firestore';

export default (app) => {
  const firestore = app.firestore();
  return firestore;
};

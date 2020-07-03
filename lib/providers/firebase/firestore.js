function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query
    .get()
    .then((snapshot) => {
      if (snapshot.size === 0) {
        return 0
      }
      const batch = db.batch()
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
      return batch.commit().then(() => snapshot.size)
    })
    .then((numDeleted) => {
      if (numDeleted === 0) {
        resolve()
        return
      }
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject)
      })
    })
    .catch(reject)
}

const deleteCollection = (db) => (collectionPath, batchSize) => {
  const collectionRef = db.collection(collectionPath)
  const query = collectionRef.orderBy('__name__').limit(batchSize)

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject)
  })
}

export default (admin) => {
  const firestore = admin.firestore()
  firestore.deleteCollection = deleteCollection(firestore)
  return firestore
}

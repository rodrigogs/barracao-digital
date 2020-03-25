export default (request) => ({
  async signUpPatient({ patient }) {
    const { data } = await request.post('/patients', patient);
    return data;
  },
});

export default {
  getEaseOutPos: (paticleId, startVal, changeVal, numOfParticles) => {
    paticleId /= numOfParticles
    paticleId--
    return changeVal * (paticleId ** 3 + 1) + startVal
  },
  getEaseInPos: (paticleId, startVal, changeVal, numOfParticles) => {
    paticleId /= numOfParticles
    return changeVal * paticleId ** 3 + startVal
  }
}

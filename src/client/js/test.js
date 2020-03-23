let date = 1568160000000;
let now = 1567565002000;

const countDown = (dateTillTrip) => {
    // Get today's date and time
    countDownDate = dateTillTrip;
    //const now = new Date().getTime();
    // Find the distance between now and the count down date
    const distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24)) + 1;
    return days;
  }
countDown(date);


//sample test to confirm working
test('true is truthy', () => {
    expect(true).toBe(true)
})

//test to ensure days are being converted properly. 
test('Countdown should be converted from unix timestap to days from now "7"', () => {
    expect(countDown(date)).toBe(7)
})

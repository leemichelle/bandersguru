const app = new Vue({
  el: '#app',
  data: {
    message: "Choose your own adventure"
  },
  methods: {
    handleClick: function() {
      const fields = document.querySelectorAll('.field')
      const results = []
      fields.forEach(ele => {
        results.push(ele.value)
      });
      let body = {
        id: results[0],
        scenario: results[1],
        currentStep: results[2]
      };
      fetch('/game',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      })
        .then(data => {
          console.log('post sent', data)
        })
        .catch(err => {
          console.log('error')
        })
    }
  }
});
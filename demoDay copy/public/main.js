let heart = document.getElementsByClassName("fa-heart");
let trash = document.getElementsByClassName("fa-trash");

Array.from(heart).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const quote = this.parentNode.parentNode.childNodes[3].innerText
        const heart = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'quote': quote,
            'heart':heart
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const quote = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({

            'quote': quote
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

function edmonds(){
  const url = ('https://api.edmunds.com/api/media/v2/{make}/{model}/{year}/photos?api_key={api_key}&fmt=json')


  .then(data => { 
    console.log(data) 
    if(data.code == 400){
        let errorMessage = 'ERROR  ' + data.msg
        alert(errorMessage)
      
    }else if(datafromNasa.media_type == 'video'){
           pic.classList.add('hide')
          video.src = datafromNasa.url
          information.innerText = datafromNasa.explanation
          title.innerText = datafromNasa.title
          video.classList.remove('hide')
    }
  }
}
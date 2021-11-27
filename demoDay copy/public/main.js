
let trash = document.getElementsByClassName("fa-trash");


Array.from(trash).forEach(function (element) {
  
  let topicTarget = JSON.parse(JSON.stringify(element.dataset)).topicId 
  console.log(topicTarget)
  element.addEventListener('click', function () {
    fetch('deleteTopic', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

        topicTarget: topicTarget


      })


    })
      .then((response) => {
        console.log('response=' + response)
        if (response.ok) return response.text();
      })
      .then((text) => {
        console.log('text=' + text)
        window.location.reload(true);
      });
  });
});

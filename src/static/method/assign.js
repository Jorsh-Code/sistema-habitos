app.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.href = '/';
    }else{
        location.href = '#head';
    }
});


let token = ['e6jNwQIqQWefw6EYYnc5Mm:APA91bFqa1k4BQsjGwyKEviEGOZbpYgxwDRiV_PdF7HWwPlBaIu7-qexsOh76MRSNlLi99yoIffJk5fFyVYKeJQ0z-dm2txmBmHqjytjp_SIglIDUphrtaIiVC9XV8njK68ZJ-pv6cbO']

async function notificacion(){
    //console.log(msm);
    var message = {
        data: {
          score: '850',
          time: '2:45'
        },
        topic: '/topic'
      };
    await msm.send(message);
}

/*token, // ['token_1', 'token_2', ...]
{
  data: {
    message: 'hola'
  },
},
{
  // Required for background/quit data-only messages on iOS
  contentAvailable: true,
  // Required for background/quit data-only messages on Android
  priority: "high",
}*/
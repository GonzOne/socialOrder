'use strict';
angular.module('main')
    .constant('Notifications', {
      messages: {
        'submitted': 'Your order has been submitted',
        'accepted': 'Your order is being made, your drink with be with you shortly.',
        'declined': '',
        'completed': '',
        'messenger': 'Hi, I have a a question for you, from : '
      },


    });

import {checkCircle, checkMyCircles} from '../../core';

export const getCirclesInfo = async (token) => {
  const myCircles = await checkMyCircles(token);

  return await Promise.all(
    await myCircles.map(
      async (circle) => await checkCircle(token, circle.circleid),
    ),
  );
};

export const renderCircles = (circles, user, extra) => {
  const chatDetailsExtra = [
    {
      circleid: '1',
      title: 'Start It Up!',
      friends: [
        {
          id: '2',
          name: 'Florian',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '1',
          name: 'you.',
          image: require('../components/images/chat2.png'),
        },
      ],
      count: '12',
    },
    {
      circleid: '2',
      title: 'Start It Up!',
      friends: [
        {
          id: '2',
          name: 'Florian',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '3',
          name: 'Katrin',
          image: require('../components/images/chat2.png'),
        },
        {
          id: '1',
          name: 'you.',
          image: require('../components/images/chat1.png'),
        },
      ],
      count: '3',
    },
    {
      circleid: '3',
      title: 'Start It Up! hjkv k jlv jk l bk hjdfjd kfkf  klgkrkhg ',
      friends: [
        {
          id: '2',
          name: 'Florian',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '3',
          name: 'Katrin',
          image: require('../components/images/chat2.png'),
        },
        {
          id: '4',
          name: 'Sorel',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '1',
          name: 'you.',
          image: require('../components/images/chat1.png'),
        },
      ],
      count: '3',
    },
    {
      circleid: '4',
      title: 'Start It Up!',
      friends: [
        {
          id: '2',
          name: 'Florian',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '3',
          name: 'Katrin',
          image: require('../components/images/chat2.png'),
        },
        {
          id: '4',
          name: 'Tom',
          image: require('../components/images/chat1.png'),
        },
        {
          id: '5',
          name: 'Sorel',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '1',
          name: 'you.',
          image: require('../components/images/chat1.png'),
        },
      ],
      count: '2',
    },
    {
      circleid: '5',
      title: 'Start It Up!',
      friends: [
        {
          id: '2',
          name: 'Florian',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '3',
          name: 'Katrin',
          image: require('../components/images/chat2.png'),
        },
        {
          id: '4',
          name: 'Tom',
          image: require('../components/images/chat1.png'),
        },
        {
          id: '5',
          name: 'Sorel',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '6',
          name: 'Behr',
          image: require('../components/images/user_demo_img.png'),
        },
        {
          id: '1',
          name: 'you.',
          image: require('../components/images/chat1.png'),
        },
      ],
      count: '2',
    },
  ];

  let chatDetails = [];

  if (extra) {
    chatDetails = chatDetailsExtra;
  }

  // console.log('circles', circles);
  circles.map((circle) => {
    const circleRender = {
      circleid: '',
      title: '',
      friends: [],
      circle,
      userid: user.userid,
    };
    // console.log('circle', circle);
    circle.map((userCircle) => {
      if (userCircle.userid !== user.userid) {
        // console.log('userCircle', userCircle);
        circleRender.circleid = userCircle.circleid;
        circleRender.title = userCircle.event.name
          ? userCircle.event.name
          : 'Circles';
        circleRender.friends.push({
          userid: userCircle.userid,
          name: userCircle.user.profile.name,
          image: userCircle.user.profile.photo
            ? {
                uri: userCircle.user.profile.photo,
              }
            : require('../components/images/test.jpg'),
        });
        // console.log('circleRender', circleRender);
      }
    });
    circleRender.friends.push({
      userid: user.userid,
      name: 'you.',
      image: user.profile.photo
        ? {
            uri: user.profile.photo,
          }
        : require('../components/images/test.jpg'),
    });
    chatDetails.push(circleRender);
  });

  return chatDetails;
};

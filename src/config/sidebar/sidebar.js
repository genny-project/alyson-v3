export default [
  {
    name: 'Home',
    path: 'home',
    icon: 'home',
  },
  {
    name: 'Dropdown',
    isDropdown: true,
    icon: 'face',
    items: [
      {
        name: 'Home',
        path: 'home',
        icon: 'home',
      },
      {
        name: 'Another dropdown',
        isDropdown: true,
        icon: 'nature-people',
        items: [
          {
            name: 'Home',
            path: 'home',
            icon: 'home',
          },
        ],
      },
      {
        name: 'Logout',
        path: 'logout',
        icon: 'power-settings-new',
      },
    ],
  },
  {
    name: 'Chat',
    path: 'chat',
    icon: 'chat',
  },
  {
    name: 'Alerts',
    path: 'alerts',
    icon: 'notifications',
  },
  {
    name: 'Profile',
    path: 'profile',
    icon: 'person',
  },
  {
    name: 'Commons',
    path: 'commons',
    icon: 'pan-tool',
  },
  {
    name: 'Logout',
    path: 'logout',
    icon: 'power-settings-new',
  },
];

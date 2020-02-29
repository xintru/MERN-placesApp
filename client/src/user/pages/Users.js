import React from 'react'

import UsersList from '../components/UsersList'

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Alex',
      image:
        'https://n1s1.hsmedia.ru/b6/26/67/b626675e457e8d5ca671eb424cca7627/1374x830_0x0a330ca2_9299960571542369527.jpeg',
      places: 3,
    },
  ]

  return <UsersList items={USERS} />
}

export default Users

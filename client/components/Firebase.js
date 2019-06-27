import React, {Component} from 'react'
import {db} from '../firebase'

export default class Users extends Component {
  constructor() {
    super()

    this.state = {
      users: []
    }
  }

  async componentDidMount() {
    db.collection('users').onSnapshot(snapshot => {
      let changes = snapshot.docChanges()
      this.setState({
        users: [...this.state.users, changes[0].doc.data()]
      })
    })
    const collection = await db.collection('users').get()
    const users = collection.docs.map(document => document.data())
    this.setState({users})
  }

  render() {
    return (
      <ul>
        {this.state.users.map(user => {
          return (
            <li key={user.name}>
              {user.name} {user.email}
            </li>
          )
        })}
      </ul>
    )
  }
}

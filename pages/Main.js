import React from 'react'
import { Home } from './Home'
import { PartyForm } from '../components/PartyForm'
import { PartyFormList } from '../components/PartyFormList'
import { Logout } from '../components/Logout'
import { ScrollView, View } from 'react-native'

export const Main = () => {
    return (
        <ScrollView style={{backgroundColor:"#fff"}}>
           <Logout />
            <Home />
            <PartyForm />
            <PartyFormList />
        </ScrollView>
    )
}

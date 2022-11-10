import React, { state, effect } from 'react';
import "../style/cardUser.css"
import LightIcon from '@mui/icons-material/Light';
import MailIcon from '@mui/icons-material/Mail';
const  cardUser = ({element, addressee})=>{
    return(
        <div className='body-card'>
            <div className='content-name-state'>
                <h4>{element.username.toUpperCase()}</h4>
                <LightIcon className={element.connected? "icon-online-active" : "icon-online-desactive"}/>
            </div>
            
            <h4 className='txt-email'>{element.email}</h4>
            <MailIcon className='icon-message' onClick={()=> addressee(element.email)}/>
        </div>
    )
}
export default cardUser;
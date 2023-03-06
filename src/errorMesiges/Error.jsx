
import React from "react";
import styles from './error.module.css'
const Error = ({ message }) => {
    return (<div className={styles.errorMessage}>
        
        <h2>{message}</h2>
    </div>)

}
export default Error
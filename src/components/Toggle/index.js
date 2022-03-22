import React from 'react'
import styles from './index.module.scss'

const Toggle = ({ value, onChange }) => (
  <label className={styles.root} htmlFor="toggler">
    <input
      id="toggler"
      type="checkbox"
      onClick={onChange}
      checked={value}
      readOnly
    />
    <span className={styles.slider} />
    <span className={styles.wave} />
  </label>
)

export default Toggle

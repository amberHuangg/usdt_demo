import React, { FC, useState } from 'react'
import { GetStaticProps } from 'next'
import styles from './index.module.scss'
import ProButton from '../components/ProButton'
import { useRouter } from 'next/router'
import useProSnackbar from '../utils/hooks/useProSnackbar'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {},
  }
}

const UsdtDemo: FC = React.memo(() => {
  const router = useRouter()
  const { enqueueSnackbarError, enqueueSnackbarSuccess } = useProSnackbar()
  const [mchId, setMchId] = useState('102349') //商户ID
  const [mchUid, setMchUid] = useState('') //商户的用户uid
  const [checkLoading, setCheckLoading] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>绑定参数</div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户ID(mch_id):</div>
        <input value={mchId} onChange={(e) => setMchId(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户的用户uid(mch_uid):</div>
        <input value={mchUid} onChange={(e) => setMchUid(e.target.value)}/>
      </div>
      <div className={styles.btn} style={{ marginTop: '0.3rem' }}>
        <ProButton
          color={'orange'}
          onClick={() => {
            // @ts-ignore
            const check = window.demo_account.isAppInstalled('pro.xworld.app')
            if (!check) {
              enqueueSnackbarError('Xworld 未安装')
            } else {
              // @ts-ignore
              window.demo_account.startXWorldBind(mchId, mchUid)
            }
          }}
        >
          Jsbridge绑定
        </ProButton>
        <ProButton
          color={'orange'}
          onClick={() => {
            window.location.href = `xworld://pro.xworld.app/bind?mch_id=${mchId}&user_id=${mchUid}`
          }}
        >
          深链绑定
        </ProButton>
      </div>
    </div>
  )
})

export default UsdtDemo

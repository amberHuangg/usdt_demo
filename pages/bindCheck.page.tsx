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
  const [res, setRes] = useState('')

  const checkFun = async () => {
    if (!mchId) {
      enqueueSnackbarError('请输入mch_id')
      return
    }
    if (!mchUid) {
      enqueueSnackbarError('请输入mch_uid')
      return
    }
    setCheckLoading(true)
    try {
      const api = await fetch(`https://api.3games.io/mch/query_bind_user`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          mch_id: mchId,
          mch_uid: mchUid,
        }),
      })
      const res = await api.json()
      setRes(JSON.stringify(res))
    } catch (e) {
    } finally {
      setCheckLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>请求参数</div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户ID(mch_id):</div>
        <input value={mchId} onChange={(e) => setMchId(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户的用户uid(mch_uid):</div>
        <input value={mchUid} onChange={(e) => setMchUid(e.target.value)}/>
      </div>
      <div className={styles.btn}>
        <ProButton fullWidth onClick={checkFun} loading={checkLoading}>
          查询
        </ProButton>
      </div>
      <div className={styles.rechargeList_extra}>返回结果：{res}</div>
    </div>
  )
})

export default UsdtDemo

import React, { FC, useState } from 'react'
import { GetStaticProps } from 'next'
import styles from './index.module.scss'
import ProButton from '../components/ProButton'
import useProSnackbar from '../utils/hooks/useProSnackbar'
import md5 from 'md5'
import { Base64 } from 'js-base64'
import ProDialogV2 from '../components/ProDialog/ProDialogV2'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {},
  }
}

const UsdtDemoWithdraw: FC = React.memo(() => {
  const { enqueueSnackbarError, enqueueSnackbarSuccess } = useProSnackbar()
  const router = useRouter()
  const queryAmount = router.query.amount as string
  const queryCurrency = router.query.currency as string

  const [currency, setCurrency] = useState(queryCurrency || 'VND') //币种
  const [mchId, setMchId] = useState('102349') //商户ID
  const [mchUid, setMchUid] = useState('') //商户的用户uid
  const [mchOrderId, setMchOrderId] = useState('') //商户的订单ID
  const [payType, setPayType] = useState('62') //支付方式
  const [amount, setAmount] = useState(queryAmount || '') //支付金额
  const [notifyUrl, setNotifyUrl] = useState('') //通知商户代付结果地址
  const [account, setAccount] = useState('') //收款人账号
  const [attach, setAttach] = useState('') //回调地址附加参数
  const [secretKey, setSecretKey] = useState('island') //组合hash的秘钥

  const [hashData, setHashData] = useState('--')
  const [base64Data, setBase64Data] = useState('--')
  const [xwolrdBind, setXworldBind] = useState(false)
  const [orderStatusDialog, setOrderStatusDialog] = useState(false)
  const [orderStatus, setOrderStatus] = useState('')

  const [addOrderLoading, setAddOrderLoading] = useState(false)
  const [checkOrderLoading, setCheckOrderLoading] = useState(false)

  const orderFun = async () => {
    if (!mchId) {
      enqueueSnackbarError('请输入mch_id')
      return
    }
    if (!mchUid) {
      enqueueSnackbarError('请输入mch_uid')
      return
    }
    if (!mchOrderId) {
      enqueueSnackbarError('请输入mch_order_id')
      return
    }
    if (!payType) {
      enqueueSnackbarError('请输入pay_type')
      return
    }
    if (!amount) {
      enqueueSnackbarError('请输入amount')
      return
    }
    if (!notifyUrl) {
      enqueueSnackbarError('请输入notify_url')
      return
    }
    if (!account) {
      enqueueSnackbarError('请输入account')
      return
    }
    let params = {
      mch_id: mchId,
      mch_order_id: mchOrderId,
      pay_type: parseInt(payType),
      amount: parseFloat(amount),
      notify_url: notifyUrl,
      account: account,
      attach: attach,
    }

    let hashStr = ''
    Object.keys(params)
      .sort()
      .forEach((key: any) => {
        // @ts-ignore
        hashStr += '&' + key + '=' + (params[key] ?? '')
      })
    hashStr += secretKey
    hashStr = hashStr.slice(1, hashStr.length)
    setHashData(hashStr)

    let paramsStr = ''
    Object.keys(params).forEach((key: any) => {
      // @ts-ignore
      paramsStr += '&' + key + '=' + (params[key] ?? '')
    })
    paramsStr = paramsStr.slice(1, paramsStr.length)

    const md5Str = md5(hashStr)
    const totalParams = paramsStr + '&' + 'hash=' + md5Str
    const rechargUrl = 'https://api.3games.io/mch/create_payment_order?' + totalParams

    const base64Data = JSON.stringify({
      ...params,
      hash: md5Str,
    })
    setBase64Data(base64Data)

    setAddOrderLoading(true)
    try {
      const api = await fetch(rechargUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          mch_id: mchId,
          mch_uid: mchUid,
          cp_para: Base64.encode(base64Data),
        }),
      })
      const { code, data, msg } = await api.json()
      if (code === 200) {
        enqueueSnackbarSuccess('代付订单生成成功')
      } else if (code === 10411) {
        // 用户未绑定
        setXworldBind(true)
        enqueueSnackbarError(msg)
      } else if (code === 10405) {
        // 代付订单已存在
        enqueueSnackbarSuccess(msg)
      } else {
        enqueueSnackbarError(msg)
      }
    } catch (e: any) {
      enqueueSnackbarError(e.massage)
    } finally {
      setAddOrderLoading(false)
    }
  }

  const checkOrder = async () => {
    if (!mchId) {
      enqueueSnackbarError('请输入mch_id')
      return
    }
    if (!mchOrderId) {
      enqueueSnackbarError('请输入mch_order_id')
      return
    }
    if (!secretKey) {
      enqueueSnackbarError('请输入secret_key')
      return
    }
    let params = {
      mch_id: mchId,
      mch_order_id: mchOrderId,
    }

    let hashStr = ''
    Object.keys(params)
      .sort()
      .forEach((key: any) => {
        // @ts-ignore
        hashStr += '&' + key + '=' + (params[key] ?? '')
      })
    hashStr += secretKey
    hashStr = hashStr.slice(1, hashStr.length)

    let paramsStr = ''
    Object.keys(params).forEach((key: any) => {
      // @ts-ignore
      paramsStr += '&' + key + '=' + (params[key] ?? '')
    })
    paramsStr = paramsStr.slice(1, paramsStr.length)

    const md5Str = md5(hashStr)
    const totalParams = paramsStr + '&' + 'hash=' + md5Str
    const rechargUrl = 'https://api.3games.io/mch/query_payment_order?' + totalParams

    const base64Data = JSON.stringify({
      ...params,
      hash: md5Str,
    })

    try {
      setCheckOrderLoading(true)
      const api = await fetch(rechargUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          mch_id: mchId,
          mch_order_id: mchOrderId,
          cp_para: Base64.encode(base64Data),
          hash: md5Str,
          currency: currency,
        }),
      })
      const { code, data, msg } = await api.json()
      if (code === 200) {
        setOrderStatusDialog(true)
        setOrderStatus(data)
        //enqueueSnackbarSuccess('查询成功')
      } else {
        enqueueSnackbarError(msg)
      }
    } catch (e: any) {
      enqueueSnackbarError(e.massage)
    } finally {
      setCheckOrderLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerTitle}>代付</div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>币种(currency,目前可填VND、USD):</div>
        <input value={currency} onChange={(e) => setCurrency(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户ID(mch_id):</div>
        <input value={mchId} onChange={(e) => setMchId(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户的用户uid(mch_uid):</div>
        <input value={mchUid} onChange={(e) => setMchUid(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>商户的订单ID(mch_order_id):</div>
        <input value={mchOrderId} onChange={(e) => setMchOrderId(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>支付方式(pay_type):</div>
        <input value={payType} onChange={(e) => setPayType(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>支付金额(amount),单位是（10000/Usdt）:</div>
        <input value={amount} onChange={(e) => setAmount(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>通知商户代付结果地址(notify_url):</div>
        <input value={notifyUrl} onChange={(e) => setNotifyUrl(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>收款人账号，XWorldPay方式此处填空(account):</div>
        <input value={account} onChange={(e) => setAccount(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>代付备注(show_types):</div>
        <input value={attach} onChange={(e) => setAttach(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>组合hash的秘钥(secret_key):</div>
        <input
          value={secretKey}
          onChange={(e) => {
            setSecretKey(e.target.value)
          }}
        />
      </div>
      <div className={styles.detail}>
        hash data：
        <br/>
        {hashData}
      </div>
      <div className={styles.detail}>
        base64 data：
        <br/>
        {base64Data}
      </div>
      <div className={styles.btn}>
        <ProButton fullWidth onClick={orderFun}>
          生成订单
        </ProButton>
      </div>
      {xwolrdBind && (
        <div className={styles.btn}>
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
      )}
      <div className={styles.btn}>
        <ProButton fullWidth onClick={checkOrder}>
          查询订单状态
        </ProButton>
      </div>
      <ProDialogV2
        open={orderStatusDialog}
        title={'订单状态'}
        onCancel={() => setOrderStatusDialog(false)}
        onClose={() => setOrderStatusDialog(false)}
        onConfirm={() => setOrderStatusDialog(false)}
        doubleBtn={false}
        content={
          <div style={{ wordWrap: 'break-word', textAlign: 'left' }}>
            {Object.keys(orderStatus).map((item: any, index) => {
              return (
                <div key={index}>
                  {item}: <span style={{ fontSize: '0.16rem' }}>{orderStatus[item]}</span>
                </div>
              )
            })}
          </div>
        }
      />
    </div>
  )
})

export default UsdtDemoWithdraw

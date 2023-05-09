import React, { FC, useState } from 'react'
import { GetStaticProps } from 'next'
import styles from './index.module.scss'
import ProButton from '../components/ProButton'
import useProSnackbar from '../utils/hooks/useProSnackbar'
import md5 from 'md5'
import { Base64 } from 'js-base64'
import ProDialogV2 from '../components/ProDialog/ProDialogV2'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {},
  }
}

const UsdtDemoRecharge: FC = React.memo(() => {
  const { enqueueSnackbarError, enqueueSnackbarSuccess } = useProSnackbar()

  const [exchangeId, setExchangeId] = useState('') //交易所ID
  const [usdtRate, setUsdtRate] = useState(0)
  const [mchId, setMchId] = useState('') //商户ID
  const [mchUid, setMchUid] = useState('') //商户的用户uid
  const [mchOrderId, setMchOrderId] = useState('') //商户的订单ID
  const [equipmentType, setEquipmentType] = useState('0') //访问类型
  const [expectedAmount, setExpectedAmount] = useState('') //充值的额度
  const [mchUrl, setMchUrl] = useState('') //回调地址
  const [showTypes, setShowTypes] = useState('') //支付类型
  const [attach, setAttach] = useState('') //回调地址附加参数
  const [secretKey, setSecretKey] = useState('') //组合hash的秘钥

  const [hashData, setHashData] = useState('--')
  const [base64Data, setBase64Data] = useState('--')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderStatusDialog, setOrderStatusDialog] = useState(false)
  const [orderStatus, setOrderStatus] = useState('')

  const [addOrderLoading, setAddOrderLoading] = useState(false)
  const [checkOrderLoading, setCheckOrderLoading] = useState(false)

  const rateFun = async () => {
    if (exchangeId) {
      const api = await fetch(`https://testapi.3games.io/property/public/exchange?exchange_id=${exchangeId}`, {
        method: 'GET',
      })
      const { code, data, msg } = await api.json()
      if (code === 200) {
        console.log(data)
        setUsdtRate(data.USD_price_ksdt)
      } else {
        enqueueSnackbarError(msg)
      }
    } else {
      enqueueSnackbarError('请输入exchange_id')
    }
  }

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
    if (!expectedAmount) {
      enqueueSnackbarError('请输入expected_amount')
      return
    }
    if (!secretKey) {
      enqueueSnackbarError('请输入secret_key')
      return
    }
    let params = {
      mch_id: mchId,
      mch_uid: mchUid,
      mch_order_id: mchOrderId,
      equipment_type: equipmentType,
      expected_amount: parseFloat(expectedAmount),
      mch_url: mchUrl,
      attach: attach,
      show_types: showTypes,
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
    const rechargUrl = 'https://testapi.3games.io/mch/create_topup_order?' + totalParams

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
          cp_para: Base64.encode(base64Data),
        }),
      })
      const { code, data, msg } = await api.json()
      if (code === 200) {
        setOrderSuccess(true)
        enqueueSnackbarSuccess('订单生成成功,请选择跳转方式')
      } else if (code === 10400) {
        //订单已生成
        setOrderSuccess(true)
        enqueueSnackbarError(msg)
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
    const rechargUrl = 'https://testapi.3games.io/mch/query_topup_order?' + totalParams

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
      <div className={styles.containerTitle}>充值</div>

      <div className={styles.input}>
        <div className={styles.inputTitle}>交易所(exchange_id):</div>
        <input value={exchangeId} onChange={(e) => setExchangeId(e.target.value)}/>
      </div>
      <div className={styles.detail}>
        费率(1美元兑换Xusdt的值)：
        <br/>
        {usdtRate}
      </div>
      <div className={styles.btn}>
        <ProButton fullWidth onClick={rateFun}>
          查询费率
        </ProButton>
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
        <div className={styles.inputTitle}>访问类型(equipment_type):</div>
        <input value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>充值的额度(expected_amount),单位是（10000/Usdt）:</div>
        <input value={expectedAmount} onChange={(e) => setExpectedAmount(e.target.value)}/>
        {usdtRate > 0 && expectedAmount && (
          <div
            className={styles.input_extra}>相当于:{parseFloat(expectedAmount) / 10000 / usdtRate}美元</div>
        )}
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>回调地址-非必填(mch_url):</div>
        <input value={mchUrl} onChange={(e) => setMchUrl(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>支付类型-非必填(show_types):</div>
        <input value={showTypes} onChange={(e) => setShowTypes(e.target.value)}/>
      </div>
      <div className={styles.input}>
        <div className={styles.inputTitle}>回调地址附加参数-非必填(show_types):</div>
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
        <ProButton fullWidth onClick={orderFun} loading={addOrderLoading}>
          生成订单
        </ProButton>
      </div>
      {orderSuccess && (
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
                window.demo_account.startXWorldPay(mchId, mchOrderId, 'test appName')
              }
            }}
          >
            Jsbridge跳转
          </ProButton>
          <ProButton
            color={'orange'}
            onClick={() => {
              window.location.href = `xworld://pro.xworld.app/pay?mch_id=${mchId}&order_id=${mchOrderId}&app_name=test appName`
            }}
          >
            深链跳转
          </ProButton>
        </div>
      )}
      <div className={styles.btn}>
        <ProButton fullWidth onClick={checkOrder} loading={checkOrderLoading}>
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

export default UsdtDemoRecharge

import React, { FC } from 'react'
import { GetStaticProps } from 'next'
import styles from './index.module.scss'
import ProButton from '../components/ProButton'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {},
  }
}

const UsdtDemo: FC = React.memo(() => {
  const router = useRouter()

  return (
    <div className={styles.usdtDemo}>
      <ProButton style={{ marginTop: '0.3rem' }} fullWidth
                 onClick={() => router.push('/bindCheck')}>
        查询玩家绑定状态
      </ProButton>
      <ProButton style={{ marginTop: '0.3rem' }} fullWidth onClick={() => router.push('/bind')}>
        绑定Xworld提现帐号
      </ProButton>
      <div className={styles.caseTitle} style={{ marginTop: '0.4rem' }}>
        发起提现订单
      </div>
      <div className={styles.caseTitle}>Case1: Deposit X amount VND</div>
      <ProButton
        style={{ marginTop: '0.1rem' }}
        fullWidth
        onClick={() => router.push('/withdraw?currency=VND&amount=100000')}
      >
        100.000VND
      </ProButton>
      <div className={styles.caseTitle}>Case1: Deposit X amount USD</div>
      <ProButton
        style={{ marginTop: '0.1rem' }}
        fullWidth
        onClick={() => router.push('/withdraw?currency=USD&amount=1.25')}
      >
        1.25USD
      </ProButton>
      <div className={styles.rechargeList_extra}>
        用户在游戏方APP充值，如提现的是游戏金币，游戏方需要根据金币实际价值锚定美金/越南盾价值，如果锚定的是
        越南盾的价值，比如提现N游戏币，需要100.000VND，请参考示例1的请求
      </div>
    </div>
  )
})

export default UsdtDemo

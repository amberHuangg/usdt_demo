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
      <ProButton fullWidth onClick={() => router.push('/recharge')}>
        充值
      </ProButton>
      <div style={{ marginTop: '0.3rem' }}>
        <ProButton fullWidth onClick={() => router.push('/withdraw')}>
          代付
        </ProButton>
      </div>
    </div>
  )
})

export default UsdtDemo

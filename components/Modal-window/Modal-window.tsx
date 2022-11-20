import {
  Button, Input, Modal, Spacer, Text, Tooltip, useInput
} from '@nextui-org/react'
import React, { useState } from 'react'

import { Mail } from '../icons/modal/icon_mail'
import { Password } from '../icons/modal/icon_password'
import { helperColor, TModalProps } from './type-modal-window'

import { useTranslation } from 'next-i18next'
import {
  useSignInMutation,
  useSignUpMutation
} from '../../features/auth/authApi'

import { useAppDispatch } from '../../features/hooks'
import { User } from '../icons/modal/icon_user'
import { validateEmail, validatePassword } from './validation'

const ModalWindow = ({ isShowing, hide, action }: TModalProps) => {
  const { t } = useTranslation('modal-window')

  const { value: nameValue, bindings: nameBindings } = useInput('')
  const {
    value: emailValue,
    setValue: setEmail,
    bindings: emailBindings,
  } = useInput('')
  const {
    value: passwordValue,
    setValue: setPwd,
    bindings: passwordBindings,
  } = useInput('')

  const [login, { isLoading }] = useSignInMutation()
  const [signUp] = useSignUpMutation()

  const [isError, setIsError] = useState(false)

  const emailHelper = React.useMemo((): {
    text: string
    color: helperColor
  } => {
    if (!emailValue)
      return {
        text: '',
        color: 'success',
      }

    const isValid = validateEmail(emailValue)
    return {
      text: isValid ? '' : `${t('unvalid-email')}`,
      color: isValid ? 'primary' : 'error',
    }
  }, [emailValue, t])

  const passwordHelper = React.useMemo((): {
    text: string
    color: helperColor
  } => {
    if (!passwordValue)
      return {
        text: '',
        color: 'success',
      }

    const isValid = validatePassword(passwordValue)

    return {
      text: isValid ? '' : `${t('unvalid-password')}`,
      color: isValid ? 'primary' : 'error',
    }
  }, [passwordValue, t])

  // Handlers
  const handleSignIn = async () => {
    try {
      await login({
        login: emailValue,
        password: passwordValue,
      })

      hide()
    } catch (error) {
      setIsError(true)
    }
  }

  const handleSignUp = async () => {
    try {
      await signUp({
        login: emailValue,
        name: nameValue,
        password: passwordValue,
      })

      await handleSignIn()

      hide()
    } catch (error) {
      setIsError(true)
    }
  }

  const handleSignInDemo = async () => {
    try {
      await login({
        login: 'TestUser',
        password: 'TestUserPwd',
      })

      hide()
    } catch (error) {
      setIsError(true)
    }
  }

  return (
    <div>
      <Modal
        closeButton
        blur
        aria-labelledby='modal-title'
        open={isShowing}
        onClose={hide}>
        <Modal.Header>
          <Text id='modal-title' size={18}>
            {
              // t('signIn')  t('signUp')
              t(action)
            }
            <Text b size={18}>
              {' '}
              CMA
            </Text>
          </Text>
        </Modal.Header>

        <Modal.Body css={{ gap: '10px', overflow: 'visible' }}>
          {action === 'signUp' && (
            <Input
              {...nameBindings}
              aria-labelledby='modal-name'
              clearable
              bordered
              fullWidth
              color='primary'
              size='lg'
              placeholder={t('Name')}
              contentLeft={<User fill='currentColor' />}
            />
          )}
          <Input
            {...emailBindings}
            aria-labelledby='modal-email'
            clearable
            bordered
            fullWidth
            color='primary'
            size='lg'
            placeholder={t('Email')}
            helperColor={emailHelper.color}
            helperText={emailHelper.text}
            contentLeft={<Mail fill='currentColor' />}
          />
          <Input.Password
            {...passwordBindings}
            aria-labelledby='modal-password'
            type='password'
            clearable
            bordered
            fullWidth
            color='primary'
            size='lg'
            placeholder={t('Password')}
            helperColor={passwordHelper.color}
            helperText={passwordHelper.text}
            contentLeft={<Password fill='currentColor' />}
          />
          {isError && <span style={{ color: 'red' }}> {t('error')}</span>}
        </Modal.Body>

        <Modal.Footer>
          <Tooltip content={t('demo-tooltip')} css={{ zIndex: 9999 }}>
            <Button auto flat onClick={handleSignInDemo}>
              {t('Demo')}
            </Button>
          </Tooltip>
          <Spacer css={{ fg: 1 }} />
          <Button auto flat color='error' onClick={hide}>
            {t('Close')}
          </Button>
          {action === 'signIn' ? (
            <Button
              auto
              type='submit'
              onClick={handleSignIn}
              disabled={
                validateEmail(emailValue) && validatePassword(passwordValue)
                  ? false
                  : true
              }>
              {t('btnSignIn')}
            </Button>
          ) : (
            <Button
              auto
              type='submit'
              onClick={handleSignUp}
              disabled={
                validateEmail(emailValue) &&
                validatePassword(passwordValue) &&
                nameValue
                  ? false
                  : true
              }>
              {t('btnSignUp')}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default ModalWindow

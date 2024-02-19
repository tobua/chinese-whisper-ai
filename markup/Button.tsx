import { scale } from 'optica'
import { type CSSProperties, type JSX, createElement } from 'react'

const buttonStyles = (disabled?: boolean): CSSProperties => ({
  background: '#10a37f',
  color: 'white',
  border: 'none',
  outline: 'none',
  padding: scale(6),
  borderRadius: scale(10),
  fontSize: scale(20),
  cursor: 'pointer',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
  textDecoration: 'none',
  ...(disabled && {
    background: 'gray',
  }),
})

export function Button({
  style,
  as = 'button',
  children,
  ...props
}: JSX.IntrinsicElements['button'] & JSX.IntrinsicElements['a'] & { as?: 'button' | 'a' }) {
  return createElement(
    as,
    {
      type: 'button',
      ...props,
      style: { ...buttonStyles(props.disabled), ...style },
    },
    children,
  )
}

import React from 'react'

export default function ProfileBadges({
    icon,
    label,
    value
}) {
  return (
    <div className='bg-white shadow-md p-4 rounded-2xl'>
      <span className='flex items-center gap-1'>
        { icon }
        <strong>{ label }</strong>: 
        &nbsp;<span className={`${value === "active" ? 'uppercase font-bold text-green-500' : ''}`}>{ value }</span>
      </span>
    </div>
  )
}

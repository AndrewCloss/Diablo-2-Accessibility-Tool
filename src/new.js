/* eslint-disable */

export default function init(keysets) {
  let script = util() 

  for (const set of keysets) {
    script += eval(`${set.type}('${set.key}', '${set.fn}', '${set.sound}', '${set.delay}')`)
  }

  return script
}

function quickcast(key, map, sound, delay) {
  return `
${key}::
  Send {${map}}
  while ( GetKeyState("${key}" , "P") )
    Click down right
  Click up right
  Send %defaultRightClick%
  ${(sound != 'null' && delay != 'null') ? 
  `QueueSound(${delay}, ${sound})` : ``}
return
`
}

function autoattack(key, map, sound, delay) {
  return `
${key}::
  send {${map}}
  send {ctrl down}
  while ( getkeystate("${key}" , "P") )
    click down left
  click up left
  send {ctrl up}}
  send %defaultleftclick%
  ${(sound != 'null' && delay != 'null') ? 
  `QueueSound(${delay}, ${sound})` : ``}
return
`
}

function leftmimicsright() {
  return `
${key}::
  Send {${map}}
  Send {Shift Down}
  while ( GetKeyState("${key}" , "P") )
    Click down left
  Click up left
  Send {Shift Up}}
  Send %defaultLeftClick%
  ${(sound != 'null' && delay != 'null') ? 
  `QueueSound(${delay}, ${sound})` : ``}
return
`
}

function swapcast() {
  return `
${key}::
  if ( not GetKeyState("${key}" , "P") )
    Sleep, ${hotkeyDelay}
    Send %defaultWeaponSwap%
    Send {${key}}
    Click down right
    Click up right
    Sleep, %weaponSwapDelay%
    Send %defaultWeaponSwap%
    ${(sound != 'null' && delay != 'null') ? 
    `QueueSound(${delay}, ${sound})` : ``}
return
`
}

function util() {
  return `
; ============================================================================
; INITIALIZATION
; ============================================================================

#NoEnv                     ; improves performance
SendMode Input             ; improves reliability
#IfWinActive, Diablo II    ; suspend outside of client

defaultRightClick = {F9}
defaultLeftClick  = {F10}
defaultWeaponSwap = {F11}
hotkeyDelay       := 1     ; in milliseconds
weaponSwapDelay   := 500   ; in milliseconds

; Sounds supported by default (%A_ScriptDir% the path to this file)
mk_toasty            = %A_ScriptDir%\\Media\\mk_toasty.mp3 
mk_testyourmight     = %A_ScriptDir%\\Media\\mk_testyourmight.mp3
mk_dundundun         = %A_ScriptDir%\\Media\\mk_dundundun.mp3
mk_playerselect      = %A_ScriptDir%\\Media\\mk_playerselect.mp3
mk_yellmortalkombat  = %A_ScriptDir%\\Media\\mk_yellmortalkombat.mp3
mk_teleport          = %A_ScriptDir%\\Media\\mk_teleport.mp3
mk_finishhim         = %A_ScriptDir%\\Media\\mk_finishhim.mp3
mk_flawlessvictory   = %A_ScriptDir%\\Media\\mk_flawlessvictory.mp3
mk_babality          = %A_ScriptDir%\\Media\\mk_babality.mp3
mk_animality         = %A_ScriptDir%\\Media\\mk_animality.mp3
mk_brutality         = %A_ScriptDir%\\Media\\mk_brutality.mp3

; Suspend script (for typing in chat)
Enter::
   Suspend, Toggle
   Send {Enter}
return

; Re-enables script in case user escapes out of text window
Escape::
   Suspend, Off
   Send {Escape}
return

QueueSound(delay, soundFile) {
   fn := Func("TriggerSound").Bind(soundFile)
   SetTimer, %fn%, -%delay%
}

TriggerSound(a) {
   SoundPlay, % a
}

; ============================================================================
; KEYBINDINGS
; ============================================================================
`
}

let stuff = [
  {
    type: 'quickcast', 
    key: 'Q', 
    map: 'F1', 
    sound: 'mk_toasty', 
    delay: '420'
  },
  {
    type: 'quickcast', 
    key: 'W', 
    map: 'F2', 
    sound: 'mk_teleport', 
    delay: '100'
  },
]

// console.log(init(stuff))
// init(stuff)
// console.log(lookupSound('mk_brutality'))

// function lookupSound(keyword)  {
//   return {
//     mk_toasty: '%A_ScriptDir%\\Media\\mk_toasty.mp3',
//     mk_testyourmight: '%A_ScriptDir%\\Media\\mk_testyourmight.mp3',
//     mk_dundundun: '%A_ScriptDir%\\Media\\mk_dundundun.mp3',
//     mk_playerselect: '%A_ScriptDir%\\Media\\mk_playerselect.mp3',
//     mk_yellmortalkombat: '%A_ScriptDir%\\Media\\mk_yellmortalkombat.mp3',
//     mk_teleport: '%A_ScriptDir%\\Media\\mk_teleport.mp3',
//     mk_finishhim: '%A_ScriptDir%\\Media\\mk_finishhim.mp3',
//     mk_flawlessvictory: '%A_ScriptDir%\\Media\\mk_flawlessvictory.mp3',
//     mk_babality: '%A_ScriptDir%\\Media\\mk_babality.mp3',
//     mk_animality: '%A_ScriptDir%\\Media\\mk_animality.mp3',
//     mk_brutality: '%A_ScriptDir%\\Media\\mk_brutality.mp3',
//   }[keyword] || keyword
// }


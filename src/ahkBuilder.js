/* eslint-disable */

export default function init(keysets, defaultLeftClick, defaultRightClick, defaultWeaponSwap) {
  let script = util(defaultLeftClick, defaultRightClick, defaultWeaponSwap) 

  try {
    for (const set of keysets) {
      // script += eval(`${set.type}('${set.key}', '${set.fn}', '${set.sound}', '${set.delay*1000}')`)
      script += eval(`${set.type}('${set.key}', '${set.key}', '${set.sound}', '${set.delay*1000}')`)
    }
  } catch (e) {
    return false
  }

  return script
}

function quickcastr(key, map, sound, delay) {
  return `
~${key}::
  Send {${key}}
  Click down right
  return

~${key} up::
  Click up right
  Send %defaultRightClick%
  ${(sound != 'null' && delay != 'null') ? 
  `SetTimer, Queue_${key}, -${delay}
  return

Queue_${key}:
  TriggerSound(${sound})
  return
` : `return`}

`
}

function autoattack(key, map, sound, delay) {
  return `
${key}::
  send {${map}}
  send {ctrl down}
  while ( getkeystate("${key}" , "P") )
  {
    click down left
  }
  click up left
  send {ctrl up}
  send %defaultleftclick%
  ${(sound != 'null' && delay != 'null') ? 
  `SetTimer, Queue_${key}, -${delay}
  return

Queue_${key}:
  TriggerSound(${sound})
  return
` : `return`}

`
}

function quickcastl(key, map, sound, delay) {
  return `
~${key}::
  Send {${key}}
  Send {Shift Down}
  Click down left
  return

~${key} up::
  Click up left
  Send {Shift Up}
  Send %defaultLeftClick%
  ${(sound != 'null' && delay != 'null') ? 
  `SetTimer, Queue_${key}, -${delay}
  return

Queue_${key}:
  TriggerSound(${sound})
  return
` : `return`}

`
}

function swapcast(key, map, sound, delay) {
  return `
${key}::
  continueWalk = 0
  if (GetKeyState("LButton", "P"))
  {
    continueWalk = 1
  }
  BlockKeyboard("On")
  Send %defaultWeaponSwap%
  Sleep, 100
  Send {${map}}
  Sleep, 100
  Click down right
  Sleep, 100
  Click up right
  Sleep, %weaponSwapDelay%
  Send %defaultWeaponSwap%
  BlockKeyboard("Off")
  If (continueWalk = 1)
  {
    click down left
    click up left
  }
  ${(sound != 'null' && delay != 'null') ? 
  `SetTimer, Queue_${key}, -${delay}
  return

Queue_${key}:
  TriggerSound(${sound})
  return
` : `return`}

`
}

function util(defaultLeftClick, defaultRightClick, defaultWeaponSwap) {
  return `
; ============================================================================
; INITIALIZATION
; ============================================================================

#NoEnv                     ; improves performance
SendMode Input             ; improves reliability
#IfWinActive, Diablo II    ; suspend outside of client

defaultLeftClick  = {${defaultLeftClick}}
defaultRightClick = {${defaultRightClick}}
defaultWeaponSwap = {${defaultWeaponSwap}}
hotkeyDelay       := 1     ; in milliseconds
weaponSwapDelay   := 750   ; in milliseconds

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

; QueueSound(delay, soundFile) {
;    fn := Func("TriggerSound").Bind(soundFile)
;    SetTimer, %fn%, -%delay%
; }

TriggerSound(a) {
   SoundPlay, % a
}

BlockKeyboard(state){
    Loop, 512
    {
        Key := Format("SC{:X}",A_Index)
        If (state = "On")
            Hotkey, *%Key%, KeyboardKey, On UseErrorLevel
        else
            Hotkey, *%Key%, KeyboardKey, Off UseErrorLevel
    }
    KeyboardKey:
    return
}
; ============================================================================
; KEYBINDINGS
; ============================================================================
`
}


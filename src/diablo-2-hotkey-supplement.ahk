;  Diablo 3 Hotkey Supplement
;  Version: 1.1
;  Author:  Andrew Closs
;  Description:
;     Automatically casts the selected skill at the cursor's location on
;     button press. Also plays sound notifications to track cooldowns and
;     durations. Effectively makes these mechanics in line with a modern ARPG.
;     -  Press one button to cast a skill on the cursor's location while having
;        the skill binded to your default right-click remain unchanged, making
;        right-click function like another button
;     -  make your left-click skill function as it would on right-click (above)
;     -  Press one button to auto move to and attack anything under the cursor
;     Using the templates documented below, you can configure the keys
;     [QWERASDF] to handle additional actions that includes alerting you when
;     buffs end or skills complete their cooldown. The available sounds
;     packaged with it are from Mortal Kombat Arcade games.
;  Prerequisites:
;     -  Requires AutoHotkey (run as administrator)
;     -  Keep skill hotkeys as [F1]-[F8]
;     -  Set default right-click skill to [F9]
;     -  Set default left-click skill to [F10] (optional)
;     -  Set weapon swap to [F11]
;     -  Unbind [QWERASDF] (move existing functions to other keys)
;  Notes:
;     -  [Enter] pauses and unpauses the script (for typing in chat)

;  ============================================================================
;  User customization
;  ============================================================================

;  Modify these as desired

;  Sounds supported by default (%A_ScriptDir% is this files path)
mk_toasty            = %A_ScriptDir%\Media\mk_toasty.mp3 
mk_testyourmight     = %A_ScriptDir%\Media\mk_testyourmight.mp3
mk_dundundun         = %A_ScriptDir%\Media\mk_dundundun.mp3
mk_playerselect      = %A_ScriptDir%\Media\mk_playerselect.mp3
mk_yellmortalkombat  = %A_ScriptDir%\Media\mk_yellmortalkombat.mp3
mk_teleport          = %A_ScriptDir%\Media\mk_teleport.mp3
mk_finishhim         = %A_ScriptDir%\Media\mk_finishhim.mp3
mk_flawlessvictory   = %A_ScriptDir%\Media\mk_flawlessvictory.mp3
mk_babality          = %A_ScriptDir%\Media\mk_babality.mp3
mk_animality         = %A_ScriptDir%\Media\mk_animality.mp3
mk_brutality         = %A_ScriptDir%\Media\mk_brutality.mp3

;  Optional, only if you want the skill to cast alongside a sound effect
keyDelays := { }
soundMaps := { }

;  Examples
; keyDelays :=   { "Q" : 2000  ; after 2 seconds
;                , "W" : 18000 ; after 18 seconds
;                , "A" : 0 }   ; immediately, to feel badass
; soundMaps :=   { "Q" : mk_toasty
;                , "W" : mk_testyourmight
;                , "A" : mk_playerselect }

;  ============================================================================
;  Configuration templates
;  ============================================================================

;  The following three templates are to adjust the functionality of your keys:

;  Example #1 makes your character automatically walk and attack anything under
;  the cursor while the key is held.
;     e.g. Good for single target skills like Berserk.

;  Example #2 makes your skill automatically function as it would on
;  right-click, where your caster goes stationary and casts on your cursor.
;     e.g. This is to keep an aura on right-click to benefit the left-click
;          skill, like Blessed Hammer with Concentration.

;  Example #3 makes your character swap weapons, cast the skill and swap back.
;     e.g. Good for buffing with extra oskills or Battle Orders.

;  IMPORTANT!
;  When copying and pasting these:
;     Replace "[KEY]" with the desired key 
;     e.g. "Q"
;     Replace "[FUNCTION]" with the corresponding function key
;     e.g. Q is "F1", R is "F4", A is "F5" ([QWERASDF] -> [F1-F8])

;  #1
;  Press [CTRL] + [KEY], hold [LMB], swap to defaultLeftClick
; [KEY]::
;    Send {[FUNCTION]}
;    Send {Ctrl Down}
;    while ( GetKeyState("[KEY]" , "P") )
;       Click down left
;    Click up left
;    Send {CTRL Up}}
;    Send %defaultLeftClick%
;    if (keyDelays.hasKey("[KEY]") && soundMaps.hasKey("[KEY]"))
;       QueueSound(keyDelays["[KEY]"], soundMaps["[KEY]"])
; return

;  #2
;  Press [SHIFT} + [KEY], hold [LMB], swap to defaultLeftClick
; [KEY]::
;    Send {[FUNCTION]}
;    Send {Shift Down}
;    while ( GetKeyState("[KEY]" , "P") )
;       Click down left
;    Click up left
;    Send {Shift Up}}
;    Send %defaultLeftClick%
;    if (keyDelays.hasKey("[KEY]") && soundMaps.hasKey("[KEY]"))
;       QueueSound(keyDelays["[KEY]"], soundMaps["[KEY]"])
; return

;  #3
;  Weapon swap, Press [KEY], click [RMB], wait for animation, weapon swap
; [KEY]::
;    if ( not GetKeyState("[KEY]" , "P") )
;       Sleep, hotkeyDelay
;       Send %defaultWeaponSwap%
;       Send {[FUNCTION]}
;       Click down right
;       Click up right
;       Sleep, weaponSwapDelay
;       Send %defaultWeaponSwap%
;       if (keyDelays.hasKey("[KEY]") && soundMaps.hasKey("[KEY]"))
;          QueueSound(keyDelays["[KEY]"], soundMaps["[KEY]"])
; return

;  ============================================================================
;  Initialization
;  ============================================================================

#NoEnv                     ; improves performance
SendMode Input             ; improves reliability
#IfWinActive, Diablo II    ; suspend outside of client

defaultRightClick = {F9}
defaultLeftClick  = {F10}
defaultWeaponSwap = {F11}
hotkeyDelay       := 1     ; in milliseconds
weaponSwapDelay   := 500   ; in milliseconds

;  ============================================================================
;  QWER
;  ============================================================================

;  Press [Q], hold [RMB], swap to defaultRightClick
Q::
   Send {F1}
   while ( GetKeyState("Q" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("Q") && soundMaps.hasKey("Q"))
      QueueSound(keyDelays["Q"], soundMaps["Q"])
return

;  Press [W], hold [RMB], swap to defaultRightClick
W::
   Send {F2}
   while ( GetKeyState("W" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("W") && soundMaps.hasKey("W"))
      QueueSound(keyDelays["W"], soundMaps["W"])
return

;  Press [E], hold [RMB], swap to defaultRightClick
E::
   Send {F3}
   while ( GetKeyState("E" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("E") && soundMaps.hasKey("E"))
      QueueSound(keyDelays["E"], soundMaps["E"])
return

;  Press [R], click [RMB], swap to defaultRightClick
R::
   Send {F4}
   while ( GetKeyState("R" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("R") && soundMaps.hasKey("R"))
      QueueSound(keyDelays["R"], soundMaps["R"])
return

;  ============================================================================
;  ASDF
;  ============================================================================

;  Press [A], hold [RMB], swap to defaultRightClick
A::
   Send {F5}
   while ( GetKeyState("A" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("A") && soundMaps.hasKey("A"))
      QueueSound(keyDelays["A"], soundMaps["A"])
return

;  Press [S], hold [RMB], swap to defaultRightClick
S::
   Send {F6}
   while ( GetKeyState("S" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("S") && soundMaps.hasKey("S"))
      QueueSound(keyDelays["S"], soundMaps["S"])
return

;  Press [D], hold [RMB], swap to defaultRightClick
D::
   Send {F7}
   while ( GetKeyState("D" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("D") && soundMaps.hasKey("D"))
      QueueSound(keyDelays["D"], soundMaps["D"])
return

;  Press [F], hold [RMB], swap to defaultRightClick
F::
   Send {F8}
   while ( GetKeyState("F" , "P") )
      Click down right
   Click up right
   Send %defaultRightClick%
   if (keyDelays.hasKey("F") && soundMaps.hasKey("F"))
      QueueSound(keyDelays["F"], soundMaps["F"])
return

;  ============================================================================
;  Utility functions
;  ============================================================================

;  Suspend script (for typing in chat)
Enter::
   Suspend, Toggle
   Send {Enter}
return

;  Re-enables script in case user escapes out of text window
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
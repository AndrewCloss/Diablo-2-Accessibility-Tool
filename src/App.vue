<template>
<div>
  <h1>Diablo II Accessibility Tool</h1>

  <p>This is an open-source macro for AutoHotKey designed for:
    <ul>
      <li>physical disabilites</li>
      <li>the carpal tunnel-prone</li>
      <li>players used to the skill casting system in modern ARPGs.</li>
    </ul>

    <p>This <strong>does not</strong> inject into the game instance or alter filers, it only interacts with your keyboard.</p>

    <b-tabs content-class="mt-3">
      <b-tab title="First" active><p>I'm the first tab</p></b-tab>
      <b-tab title="Second"><p>I'm the second tab</p></b-tab>
      <b-tab title="Disabled" disabled><p>I'm a disabled tab!</p></b-tab>
    </b-tabs>
    <hr>

    <p>makes the Diablo II skill casting system play more like modern ARPGS. This does not inject into the game instance or alter game files, it only interacts with your keyboard.</p>
  <p>Normally in Diablo II every skill must be swapped to the active spell slot and then casted via mouse click. This cuts user input by at least half through binding swapping and casting to one input, and (as desired) also handling weapon swaps with that one input (e.g. swapping weapons, casting Battle Orders, swapping back).</p>
  <p>Additionally Diablo II lacks quality of life features to alert you when buffs end or skills complete their cooldown, this provides an alert system.</p>

  <label for="uploader">Upload your existing config.json</label>
  <input type="file" id="uploader" @change="previewFiles">
  <hr>

  <div v-for="(map, index) in maps" :key="index">
    <label :for="'key.' + index" >Mapping</label>
    <select v-model="map.type"> 
      <option disabled selected :value=null>Required</option>
      <option v-for="(type, id) in types" :value="type.value" :key="id">{{ type.label }}</option>
    </select>

    <label :for="'key.' + index" >Key</label>
    <input 
      :id="'key.' + index" 
      v-model="map.key" 
      @input="map.key = $event.target.value.toUpperCase()"
      autocomplete="false"
      placeholder="e.g. 'Q'"
      maxlength="1"
    >

    <label :for="'fn.' + index" >Function key</label>
    <select v-model="map.function"> 
      <option v-for="fn in functions" :key="fn">{{ fn }}</option>
    </select>

    <label :for="'sound.' + index" >Sound</label>
    <select v-model="map.sound"> 
      <option selected :value=null>None</option>
      <option v-for="(sound, id) in sounds" :value="sound.value" :key="id">{{ sound.label }}</option>
    </select>

    <label :for="'delay.' + index" >Delay</label>
    <input 
      :id="'delay.' + index" 
      v-model="map.delay" 
      type="number"
      autocomplete="false"
      placeholder="e.g. 180 (seconds)"
      maxlength="3"
    >

    <button type="button" @click="maps.splice(index, 1)">Delete</button>
  </div>

  <button type="button" @click="maps.push({type: null, sound: null})">Add new</button>

  <hr>
  <button type="button" @click="buildZip">Download build (zipped)</button>
</div>
</template>

<script>
import JSZip from "jszip"
import ahkBuilder from "./new.js"
import { saveAs } from 'file-saver'
import { BTabs, BTab } from 'bootstrap-vue'

/*
TODO:
- set up real vue project: https://cli.vuejs.org/guide/creating-a-project.html
- zip audio files
- style with bootstrap
*/

export default {
  name: "App",
  components: {
    'b-tabs': BTabs,
    'b-tab': BTab
  },
  data() {
    return {
      maps: [],
      types: [
        { "label": "Quick cast", "value": "quickcast" },
        { "label": "Auto attack", "value": "autoattack" },
        { "label": "Left mimics right", "value": "leftmimicsright" },
        { "label": "Swap and buff", "value": "swapcast" },
      ],
      functions: ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"],
      sounds: [ 
        { "label": "mk_animality", "value": "%A_ScriptDir%\\Media\\mk_animality.mp3" },
        { "label": "mk_babality", "value": "%A_ScriptDir%\\Media\\mk_babality.mp3" },
        { "label": "mk_brutality", "value": "%A_ScriptDir%\\Media\\mk_brutality.mp3" },
        { "label": "mk_dundundun", "value": "%A_ScriptDir%\\Media\\mk_dundundun.mp3" },
        { "label": "mk_finishhim", "value": "%A_ScriptDir%\\Media\\mk_finishhim.mp3" },
        { "label": "mk_flawlessvictory", "value": "%A_ScriptDir%\\Media\\mk_flawlessvictory.mp3" },
        { "label": "mk_playerselect", "value": "%A_ScriptDir%\\Media\\mk_playerselect.mp3" },
        { "label": "mk_teleport", "value": "%A_ScriptDir%\\Media\\mk_teleport.mp3" },
        { "label": "mk_testyourmight", "value": "%A_ScriptDir%\\Media\\mk_testyourmight.mp3" },
        { "label": "mk_toasty", "value": "%A_ScriptDir%\\Media\\mk_toasty.mp3" },
        { "label": "mk_yellmortalkombat", "value": '%A_ScriptDir%\\Media\\mk_yellmortalkombat.mp3' },
      ],
    }
  },
  computed: {
    toMilliseconds: (seconds) => seconds * 1000
  },
  mounted() {
    this.maps.push(
      {type: "quickcast", key: "Q", fn:"F1", sound: null, delay: null},
      {type: null, key: "W", fn:"F2", sound: null, delay: null},
      {type: null, key: "E", fn:"F3", sound: null, delay: null},
      {type: null, key: "R", fn:"F4", sound: null, delay: null}
    )
  },
  methods: {
    previewFiles: function(event) {
      try {
        if (event.target.files[0].type !== "application/json") {
          throw "Not JSON."
        }

        let reader = new FileReader();
        reader.readAsText(event.target.files[0])
        reader.onload = function(e) {
          this.maps = JSON.parse(e.target.result)
        }
      } catch (e) {
        console.log("Failed to parse config.json, please make a new one.")
      }
    },
    buildZip: function() {
      console.log(ahkBuilder(this.maps))

      var zip = new JSZip()
      zip.file("config.json", JSON.stringify(this.maps))
      zip.file("diablo-2-accessibility-tool.ahk", ahkBuilder(this.maps))

      /* fetch('./media/mk_toasty.mp3', {mode: 'no-cors'}) */
  /* .then(response => response.text()) */
  /* .then(data=> console.log(data)) */
  /* .catch(error => console.error(error)); */
      /* // create a file and a folder */
      /* zip.file("nested/hello.txt", "Hello World\n"); */
      /* // same as */
      /* zip.folder("nested").file("hello.txt", "Hello World\n"); */

      zip.generateAsync({type:"blob"})
      .then(function (blob) {
          saveAs(blob, "diablo-2-accessibility.zip");
      });
    }
}
}
</script>

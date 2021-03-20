<template>
<div>

  <div class="container">
    <h1 class="text-center">Diablo II Accessibility Tool v1.1</h1>

    <div class="row mb-2">
      <div class="col pl-0 pr-1">
        <b-card class="h-100" no-body>
          <b-tabs card>
            <b-tab title="Overview">
            <p>This is an open-source macro for <a href="https://www.autohotkey.com/">AutoHotKey</a> designed for:

            <ul>
              <li>physical disabilites</li>
              <li>the carpal tunnel-prone</li>
              <li>players used to the skill casting system in modern ARPGs.</li>
            </ul>

            <p>This <strong>does not</strong> inject into the game instance or alter files, it only interacts with your keyboard.</p>

            <p>Before the Diablo 2 Accessibility Tool, every skill had to be swapped to the active spell slot and then casted via mouse click.</p>
            <p><strong>Features</strong></p>
            <ul>
              <li>All actions are reduced to one button, including:
                <ul>
                  <li>Casting on cursor (left or right slot)</li>
                  <li>Auto move and attack all-in-one</li>
                  <li>Swap, buff and swap back</li>
                </ul>
              </li>
              <li>
                Casting can alert you when buffs end with a sound effect
              </li>
            </ul>
          </b-tab>
          <b-tab title="FAQ">
            <ul>
              <li class="pb-5">Instructions to run a AutoHotKey macro are covered <a href="https://letmegooglethat.com/?q=how+to+run+autohotkey+script">elsewhere on the web.</a></li>
              <li class="pb-5">The auto attack-move works significantly better than Vanilla, as it's mimicing CTRL+Left click thousands of times a minute.</li>
              <li class="pb-5">The default left click, default right click and weapon swap are required to generate the script, however they don't have to be bound in-game.</li>
              <li class="pb-5">See the source code at <a href="https://github.com/AndrewCloss/Diablo-2-Accessibility-Tool">https://github.com/AndrewCloss/Diablo-2-Accessibility-Tool</a></li>
            </ul>
          </b-tab>
          </b-tabs>
        </b-card>
      </div>

      <div class="col pl-1 pr-0">
        <b-card class="mb-2">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/3Rp2FSW45zo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </b-card>
        <b-card class="pb-5">
          <div class="row">
            <div class="col">
            <label class="form-label" for="uploader">Upload your existing config.json</label>
          </div>
            <div class="col">
            <input class="form-control-file" type="file" id="uploader" @change="previewFiles">
          </div>
          </div>
          <p v-if="error" style="color: red">{{ error }}</p>
        </b-card>
      </div>
    </div>


    <div class="mx-n3">
      <b-card>
        <div class="mb-3">
          <div class="row" v-for="(map, index) in config.maps" :key="index">
            <div class="col-auto">
              <label :for="'key.' + index" class="form-label">Mapping</label>
              <b-form-select class="form-select" v-model="map.type"> 
                <b-form-select-option disabled selected :value=null>Required</b-form-select-option>
                <b-form-select-option v-for="(type, id) in types" :value="type.value" :key="id">{{ type.label }}</b-form-select-option>
              </b-form-select>
            </div>

            <div class="col-auto">
              <label :for="'key.' + index" class="form-label">Key</label>
              <input 
                style="width: 6rem;"
                class="form-control"
                :id="'key.' + index" 
                v-model="map.key" 
                @input="map.key = $event.target.value.toUpperCase()"
                autocomplete="false"
                placeholder="e.g. 'Q'"
                maxlength="2"
              >
            </div>

          <!--
          <div class="col-auto">
            <label :for="'fn.' + index" class="form-label">Function key</label>
            <select class="form-select" v-model="map.fn"> 
              <b-form-select-option v-for="fn in functions" :key="fn">{{ fn }}</b-form-select-option>
            </select>
          </div>
          -->

            <div class="col-auto">
              <label :for="'sound.' + index" class="form-label">Sound</label>
              <b-form-select class="form-select" v-model="map.sound"> 
                <b-form-select-option selected :value=null>None</b-form-select-option>
                <b-form-select-option v-for="(sound, id) in sounds" :value="sound.label" :key="id">{{ sound.label }}</b-form-select-option>
              </b-form-select>
            </div>

            <div class="col-auto">
              <label :for="'delay.' + index" class="form-label">Sound Delay (seconds)</label>
              <input 
                class="form-control"
                style="width: 8rem;"
                :id="'delay.' + index" 
                v-model="map.delay" 
                type="number"
                autocomplete="false"
                placeholder="e.g. '180'"
                maxlength="3"
              >
            </div>

            <div class="col align-self-end">
              <button type="button" class="btn btn-danger float-right" @click="config.maps.splice(index, 1)">Delete</button>
            </div>
          </div>
        </div>

        <div class="row pb-1">
          <div class="col align-self-end">
            <button type="button" class="btn btn-success mx-1" @click="config.maps.push({type: null, sound: null})">Add new</button>
          </div>
        </div>
        <div class="row">
          <div class="col-auto">
            <label for="defaultLeftClick" class="form-label">Default left-click</label>
            <input 
              style="width: 6rem;"
              class="form-control "
              id="defaultLeftClick" 
              v-model="config.defaultLeftClick" 
              @input="config.defaultLeftClick = $event.target.value.toUpperCase()"
              autocomplete="false"
              maxlength="2"
            >
          </div>
          <div class="col-auto">
            <label for="defaultRightClick" class="form-label">Default right-click</label>
            <input 
              style="width: 6rem;"
              class="form-control"
              id="defaultRightClick" 
              v-model="config.defaultRightClick" 
              @input="config.defaultRightClick = $event.target.value.toUpperCase()"
              autocomplete="false"
              maxlength="2"
            >
          </div>
          <div class="col-auto">
            <label for="defaultWeaponSwap" class="form-label">Default weapon swap</label>
            <input 
              style="width: 6rem;"
              class="form-control"
              id="defaultWeaponSwap" 
              v-model="config.defaultWeaponSwap" 
              @input="config.defaultWeaponSwap = $event.target.value.toUpperCase()"
              autocomplete="false"
              maxlength="2"
            >
          </div>
          <div class="col align-self-end">
            <button type="button" class="btn btn-primary mx-1" @click="buildZip">Download build (zipped)</button>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import JSZip, { loadAsync } from "jszip"
/* eslint-disable no-unused-vars */
import JSZipUtils from "jszip-utils"
import ahkBuilder from "./ahkBuilder.js"
import { saveAs } from 'file-saver'
import { BTab, BTabs, BCard, BFormSelect, BFormSelectOption } from 'bootstrap-vue'

/*
TODO:
- set up real vue project: https://cli.vuejs.org/guide/creating-a-project.html
- style with bootstrap
- convert s to ms
- videos
 */


export default {
  name: "App",
  components: {
    'b-tab': BTab,
    'b-tabs': BTabs,
    'b-card': BCard,
    'b-form-select': BFormSelect,
    'b-form-select-option': BFormSelectOption,
  },
  data() {
    return {
      config: {
        maps: [],
        defaultLeftClick: "F1",
        defaultRightClick: "F2",
        defaultWeaponSwap: "F3",
      },
      types: [
        { "label": "Quick cast (right)", "value": "quickcastr" },
        { "label": "Quick cast (left)", "value": "quickcastl" },
        { "label": "Auto attack", "value": "autoattack" },
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
      temp: null,
      error: false,
    }
  },
  mounted() {
    this.config.maps.push(
      {type: "quickcastr", key: "Q", fn:"F1", sound: null, delay: 0},
      {type: "quickcastr", key: "W", fn:"F2", sound: null, delay: 0},
      {type: "quickcastr", key: "E", fn:"F3", sound: null, delay: 0},
      {type: "quickcastr", key: "R", fn:"F4", sound: null, delay: 0}
    )
  },
  methods: {
    previewFiles: function(event) {
      try {
        if (event.target.files[0].type !== "application/json") throw "Not JSON."

        let reader = new FileReader();
        reader.readAsText(event.target.files[0])
        reader.onload = (e) => this.config = JSON.parse(e.target.result)
      } catch (e) {
        this.error = "Failed to parse config.json, please make a new one."
      }
    },
    buildZip: function() {
      // error checking
      for (const map of this.config.maps) {
        if (!map.type || !map.key) {
          this.error = "Please delete maps without a key."
          return
        }
      }
      if (!this.config.defaultLeftClick || !this.config.defaultRightClick || !this.config.defaultWeaponSwap) {
        this.error = "Missing default options."
        return
      }

      var self = this

      JSZipUtils.getBinaryContent('media.zip', function(err, data) {
        new loadAsync(data)
          .then(function (zip) {
        try {
            zip.file("config.json", JSON.stringify(self.config))
            let ahkBuild = ahkBuilder(self.config.maps, self.config.defaultLeftClick, self.config.defaultRightClick, self.config.defaultWeaponSwap)
            /* let ahkBuild = ahkBuilder(self.config.maps) */
            if (!ahkBuild) throw 'Failed.'
            zip.file("diablo-2-accessibility-tool.ahk", ahkBuild)

            zip.generateAsync({type:"blob"})
            .then(function (blob) {
                saveAs(blob, "diablo-2-accessibility.zip");
            });
        } catch (e) {
          self.uploadError = "Failed to build, please check for missing required options."
        }
          });
      })
    }
  }
}
</script>

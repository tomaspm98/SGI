import * as THREE from 'three';
import {MyAxis} from './MyAxis.js';
import {MyFileReader} from './parser/MyFileReader.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
     constructs the object
     @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.axis = null
        
        this.textures_map = new Map()
        this.materials_map = new Map()
        this.cameras_map = new Map()
        this.lights_map = new Map()
        this.lights_enabled = new Map()
        
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/demo/demo.xml");
    
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        //console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
        this.app.updateGui()
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        this.renderTextures(data)//renders the textures
        this.renderMaterials(data)//renders materials  
        this.renderBackground(data)
        this.renderFog(data)
        this.renderCameras(data)
        this.renderLights(data)
        console.log(data.nodes)
        //this.renderGeometries(data)        
            
        //para testar objetos hardcoded (se necessario adicionar mais fontes de luz)
        const light = new THREE.PointLight(0xffffff, 1000, 20);
        light.position.set(10, 10, 10);
        //this.app.scene.add(light);
        const box = new THREE.BoxGeometry(5, 5, 5);
        const boxMesh = new THREE.Mesh(box, this.materials_map.get('crimeWeaponApp'));
        this.app.scene.add(boxMesh)
        for (const [key, value] of this.lights_map.entries()) {
           this.app.scene.add(value);
          }

        }
    

    renderTextures(data) {
        for (let key in data.textures) {
            let texture = data.textures[key]
            if (texture.type === 'texture')
                this.textures_map.set(texture.id, new THREE.TextureLoader().load(texture.filepath))
        }
    }

    renderMaterials(data) {
        for (let key in data.materials) {
            let material = data.materials[key]
            if (material.type === 'material')
                this.materials_map.set(material.id, new THREE.MeshPhongMaterial({
                    color: this.rgbToHex(material.color),
                    specular: this.rgbToHex(material.specular),
                    emissive: this.rgbToHex(material.emissive),
                    shininess: material.shininess,
                    map: this.textures_map.get(material.textureref),
                    wireframe: material.wireframe,
                    bumpScale: material.bump_scale,
                }))
        }
    }

    renderBackground(data) {
        if (data.options.type === 'globals') {
            const ambientLight = new THREE.AmbientLight(this.rgbToHex(data.options.ambient))
            this.app.scene.add(ambientLight)
            this.app.scene.background = new THREE.Color(this.rgbToHex(data.options.background))
        }

    }

    renderFog(data) {
        if (data.fog.type === 'fog') {
            this.app.scene.fog = new THREE.Fog(this.rgbToHex(data.fog.color), data.fog.near, data.fog.far)
        }
    }

    renderCameras(data) {
        for (let key in data.cameras) {
            let camera = data.cameras[key]
            if (camera.type === 'orthogonal') {
                console.log(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
                this.cameras_map.set(camera.id, new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far))
                this.cameras_map.get(camera.id).position.set(...camera.location)
                this.cameras_map.get(camera.id).lookAt(...camera.target)
                
            } else if (camera.type === 'perspective') {
                this.cameras_map.set(camera.id, new THREE.PerspectiveCamera(camera.angle, 1, camera.near, camera.far))
                this.cameras_map.get(camera.id).position.set(...camera.location)
                this.cameras_map.get(camera.id).lookAt(...camera.target)
            }
        }
        this.activeCamera = data.activeCameraId
    }

    renderLights(data){
        for (let key in data.nodes){
            let child = data.nodes[key]
            if (child.id == data.rootId)
                for (let key in child.children){
                    let light = child.children[key]
                    if (light.type === 'spotlight'){
                        this.lights_map.set(light.id, new THREE.SpotLight(this.rgbToHex(light.color), light.intensity, light.distance, light.angle, light.penumbra, light.decay))
                        this.lights_map.get(light.id).position.set(...light.position)
                        const targetObject = new THREE.Object3D();
                        targetObject.position.set(light.target);
                        this.app.scene.add(targetObject);
                        light.target = targetObject;
                        if (light.castshadow === 'true'){
                            this.lights_map.get(light.id).castShadow = true
                            this.lights_map.get(light.id).shadow.camera.far = light.shadowfar;
                            this.lights_map.get(light.id).shadow.mapSize = light.shadowmapsize;
                        }
                        this.lights_enabled.set(light.id, light.enabled)

                    } else if (light.type === 'pointlight'){
                        this.lights_map.set(light.id, new THREE.PointLight(this.rgbToHex(light.color), light.intensity, light.distance, light.decay))
                        this.lights_map.get(light.id).position.set(...light.position)
                        const targetObject = new THREE.Object3D();
                        targetObject.position.set(light.target);
                        this.app.scene.add(targetObject);
                        light.target = targetObject;
                        if (light.castshadow === 'true'){
                            this.lights_map.get(light.id).castShadow = true
                            this.lights_map.get(light.id).shadow.camera.far = light.shadowfar;
                            this.lights_map.get(light.id).shadow.mapSize = light.shadowmapsize;
                        }
                        this.lights_enabled.set(light.id, light.enabled)

                    } else if (light.type === 'directionallight'){
                        this.lights_map.set(light.id, new THREE.DirectionalLight(this.rgbToHex(light.color),light.intensity))
                        this.lights_map.get(light.id).position.set(...light.position)
                        if (light.castshadow === 'true'){
                            this.lights_map.get(light.id).castShadow = true
                            this.lights_map.get(light.id).shadow.camera.far = light.shadowfar;
                            this.lights_map.get(light.id).shadow.mapSize = light.shadowmapsize;
                            this.lights_map.get(light.id).shadow.camera.left = light.shadowleft;
                            this.lights_map.get(light.id).shadow.camera.right = light.shadowright;
                            this.lights_map.get(light.id).shadow.camera.bottom = light.shadowbottom;
                            this.lights_map.get(light.id).shadow.camera.top = light.shadowtop;
                        }
                        this.lights_enabled.set(light.id, light.enabled)

                    }
        }
    }
}

    renderGeometries(data){
        for (let key in data.nodes){
            let child = data.nodes[key]
            for (let key in child.children){
                if (child.children[key].type === 'primitive'){
                    let primitive = child.children[key]
                    console.log(primitive)
                    switch(primitive.subtype){
                        case 'rectangle':
                            const width = Math.abs(primitive.xy2[0] - primitive.xy1[0])
                            const height = Math.abs(primitive.xy2[1] - primitive.xy1[1])
                            const rectangle = new THREE.BoxGeometry(width, height, primitive.parts_x, primitive.parts_y)
                            break;
                        case 'model3d':
                            const model = new THREE.ObjectLoader().load(primitive.filepath)
                            break;  
                        case 'sphere':
                            const sphere = new THREE.SphereGeometry(primitive.radius, primitive.slices, primitive.stacks, primitive.phistart, primitive.philength, primitive.thetastart, primitive.thetalength)   
                            break;
                        case 'box':
                            const widthBox = Math.abs(primitive.xy2[0] - primitive.xy1[0])
                            const heightBox = Math.abs(primitive.xy2[1] - primitive.xy1[1])        
                            const depthBox = Math.abs(primitive.xy2[2] - primitive.xy1[2])
                            const box = new THREE.BoxGeometry(widthBox, heightBox, depthBox, primitive.parts_x, primitive.parts_y, primitive.parts_z)
                            break;
                        case 'cylinder':
                            const cylinder = new THREE.CylinderGeometry(primitive.top, primitive.base, primitive.height, primitive.slices, primitive.stacks, primitive.capsclose, primitive.thetastart, primitive.thetalength)
                            break;
                        //falta nurbs e control points  

                    }
                }
             }
        }       
    }


    update() {

    }

    printData(data) {
        this.output(data.options)
        console.log("textures:")
        console.log(data.textures)
        for (let key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (let key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }
        console.log(data.materials)

        console.log(data.cameras)
        console.log(data.options)

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }
        console.log("nodes:")
        console.log(data.nodes)
        for (let key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i = 0; i < node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with " + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                } else {
                    this.output(child, 2)
                }
            }
        }
    }


    rgbToHex(color) {

        // Convert to hexadecimal and return
        return '#' +
            ('0' + Math.round(color.r * 255).toString(16)).slice(-2) +
            ('0' + Math.round(color.g * 255).toString(16)).slice(-2) +
            ('0' + Math.round(color.b * 255).toString(16)).slice(-2);
    }
}

export {MyContents};
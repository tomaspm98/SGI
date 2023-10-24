import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");
        
        this.dict_textures = []
        this.dict_materials = []
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
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) { 
        this.renderTextures(data) //renders the textures
        this.renderMaterials(data) //renders materials     

        //para testar objetos hardcoded (se necessario adicionar mais fontes de luz)
        const light = new THREE.PointLight( 0xffffff, 1000, 20 );
        light.position.set( 10, 10, 10 );
        this.app.scene.add( light );
        const box = new THREE.BoxGeometry(5,5,5);
        const boxMesh = new THREE.Mesh(box, this.dict_materials['crimeWeaponApp']);
        this.app.scene.add(boxMesh)


    }

    renderTextures(data){
        for (let key in data.textures){
            let texture = data.textures[key]
            this.dict_textures[texture.id]= new THREE.TextureLoader().load(texture.filepath)
        }
    }

    renderMaterials(data){
        for (let key in data.materials){
            let material = data.materials[key]
            this.dict_materials[material.id]= new THREE.MeshPhongMaterial({
                color:this.rgbToHex(material.color),
                specular: this.rgbToHex(material.specular),
                emissive: this.rgbToHex(material.emissive),
                shininess: material.shininess,
                map:this.dict_textures[material.textureref],
                wireframe: material.wireframe,
                bumpScale: material.bump_scale,
            })
        }
    }
    

    update() {
        
    }

    printData(data){
        /*this.output(data.options)
        console.log("textures:")
        console.log(data.textures)
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }*/

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }
        console.log(data.materials)

        /*console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }*/
    }

    rgbToHex(color) {
      
        // Convert to hexadecimal and return
        return '#' +
          ('0' + Math.round(color.r * 255).toString(16)).slice(-2) +
          ('0' + Math.round(color.g * 255).toString(16)).slice(-2) +
          ('0' + Math.round(color.b * 255).toString(16)).slice(-2);
      }
}

export { MyContents };
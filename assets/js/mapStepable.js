import SAT from 'sat';
import { Canvas } from './objects/canvas';

export class mapStepable {
    constructor(config, player) {
        this.config = config;
        this.player = player;
        this.class = 'stepable';
        this.shapes;
        this.response;
        this.canvas_obj;
        this.canvas;
        this.context;
    }

    async init() {
        let game_type = await this.player.get('type');
        let stepable_query = await this.getMapStepableQuery(game_type);
        this.shapes = JSON.parse(stepable_query.object);
        this.response = new Response();
        this.canvas_obj = new Canvas();
        [this.canvas, this.context] = this.canvas_obj.createCanvas(this.class, this.config.canvas.width, this.config.canvas.height);
        this.canvas_obj.addCanvas('#stepable', this.canvas);
    }

    async getMapStepableQuery() {
      let game_type = await this.player.get('type');
      const sql = `SELECT * FROM map_stepables WHERE title = '${game_type}';`;
  
      return await this.config.db.query(sql, true);
    }

    vector(x, y) {
        return {x: x, y: y};
    }

    setNotStepAbleShapes(player_pos) {
        let shapes = [];
        let xx = parseInt(player_pos.x - (this.config.canvas.width / 2));
        let yy = parseInt(player_pos.y - (this.config.canvas.height / 2));

        Object.values(this.shapes).forEach((shape) => {
            let vectors = [];

            shape.forEach((point) => {
                let x = parseInt(point.x) - xx;
                let y = parseInt(point.y) - yy;
                let vector = this.vector(x, y);
                vectors.push(vector);
            });

            let start_vector = this.vector(0,0);
            let polygon = new SAT.Polygon(start_vector, vectors);
            shapes.push(polygon);
        });

        return shapes;
    }



    checkIsStepable(player_pos) {
        let circle_pos = { x: (this.config.canvas.x + this.config.outfit.width), y: (this.config.canvas.y + this.config.outfit.height) };
        let player = new SAT.Circle(circle_pos, this.config.outfit.width);
        let shapes = this.setNotStepAbleShapes(player_pos);
        let stepable = false;

        Object.values(shapes).forEach((shape) => {
            let response = new SAT.Response();
            response.clear();

            if ( SAT.testPolygonCircle(shape, player, response) ) {
                stepable = true;
            }
        });

        if (stepable) { return true; }

        if ( this.config.map.drawStepableShadow ) {
            this.drawStepAbleContext(player_pos);
        }

        return false;
    }

    drawStepAbleContext(player_pos) {
        let shapes = this.setNotStepAbleShapes(player_pos);
        this.context.strokeStyle = "#FFFFFF";
        this.context.fillStyle = "rgba(255,255,255,0.25)";
        this.context.clearRect(0, 0, this.config.canvas.width, this.config.canvas.height);
        this.context.save();

        Object.values(shapes).forEach((shape) => {
            this.context.beginPath();
            this.context.moveTo(shape.points[0].x, shape.points[0].y);

            for ( let i = 0 ; i < shape.points.length ; i++ ) {
                this.context.lineTo(shape.points[i].x , shape.points[i].y);
            };

            this.context.closePath();
            this.context.fill();
            this.context.stroke();
        });
    }
}
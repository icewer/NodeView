	
	/* Variables Globales */
	
	var Ver = false, go=true, spin=2, c,JSInput, UserInput = "", LineasD =[], NodosD = [], TextoD = [], Lista;Colores = ["red","green","orange","purple","yellow","blue","black"], ListaNodos = [], NodosProcesables = [];NodosDibujar = [];
	var Radianes = (Math.PI / 180);
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var cX = canvas.width / 2;
	var cY = canvas.height / 2;
	var tp = true;
	var LongLinea = 1, Escala = 1.0, mult = 0.8;
	var arot = 0;
	var TrP = {x:cX,y:cY};
	var Raiz, A=0, nY, Hijo, radio, xT, yT, Color, JSn, JSh;
	var tNodos = 1, tEnlaces = 0, tPadres = 1, tProf = 0;
	
	/* FUNCIONES DEL CANVAS */
	
	function zoom(acercar) {
		if (acercar) Escala /= mult;
		else Escala *= mult;
		DibujarNodos(Escala,TrP,arot);
	    }
	function desp_ver(mas) {
		if (mas) TrP.y += 80 * Escala;
		else TrP.y -= 80 * Escala;
		DibujarNodos(Escala,TrP,arot);
	    }
	function desp_hor(mas) {
		if (mas) TrP.x += 80 * Escala;
		else TrP.x -= 80 * Escala;
		DibujarNodos(Escala,TrP,arot);
	    }
	function rotar(dir){
		arot = dir ? arot+(Math.PI / 10) : arot-(Math.PI / 10);
		DibujarNodos(Escala,TrP,arot);
	}
	function limpiar(){
		context.clearRect(0,0,canvas.width,canvas.height); // Limpiamos el canvas
	}
	function tParam(p){
		var a = p ? 200 : -180;
		$('#Params').animate({left: a});
		tp = !tp;
	}
	function autorotado(){
		arot += Math.PI / 359 * spin;
		DibujarNodos(Escala,TrP,arot);
	}
	function animar(p){
		c = p ? setInterval(autorotado, 20) : clearInterval(c); 
		go = !go;
	}
	
	/* DEFINICION DE LA CLASE NODO */
	
	function Nodo(nombre,hijos,posX,posY,ox,oy,prof,ang,hp,radio){
		this.Nombre = nombre;
		this.Prof = prof;
		this.Radio = radio;
		this.A = ang;
		this.esHijo = hp;
		this.XPadre = ox;
		this.YPadre = oy;
		this.X = posX;
		this.Y = posY;
		this.Hijos = typeof(hijos) === 'string' ? "": hijos; // Fix para que coja Strings en los nodos
		this.NumHijos = this.Hijos.length;
		this.TieneHijos = this.NumHijos > 0;
	  }
	  
	/* ALGORITMO DE PROCESADO DE NODOS */
	
	function ProcesarNodo(MasterNode,esJSON){
		tProf=MasterNode.Prof+1;
	    NodosProcesables.pop();
		// Si los hijos tienen hijos, los añadimos
		for (var i = 0; i < MasterNode.Hijos.length; i++) {
			EscalarLinea=3/tProf;
			if (MasterNode.esHijo) A = ((360 / (MasterNode.NumHijos + 1)) * (i + 1) + 180) * Radianes+(MasterNode.A); // Alineación con el enlace del padre
			else { A = (360 / (MasterNode.NumHijos)) * i * Radianes; tPadres++;}
			radio = 15 / tProf;
			JSn = esJSON ? MasterNode.Hijos[i].Name : "["+MasterNode.Hijos[i]+"]";
			JSh = esJSON ? MasterNode.Hijos[i].Children : MasterNode.Hijos[i];
			nX = MasterNode.XPadre + Math.cos(A) * 50 * EscalarLinea;
			nY = MasterNode.YPadre - Math.sin(A) * 50 * EscalarLinea;	
			Hijo = new Nodo(JSn,JSh,MasterNode.XPadre,MasterNode.YPadre,nX,nY,MasterNode.Prof+1,A,true,radio);
			if (Hijo.TieneHijos) NodosProcesables.push(Hijo);
			NodosDibujar.push(Hijo);}
		// Si quedan nodos, seguimos procesando de atrás a adelante (por el funcionamiento tipo pila del push/pop)
		if (NodosProcesables.length > 0) ProcesarNodo(NodosProcesables[NodosProcesables.length -1],esJSON);
		else Estadisticas();
	}
	
	/* RENDERIZADO DE LOS NODOS EN EL CANVAS */
	
	function DibujarNodos(esc,trns,rot){
		Lista = NodosDibujar; 
		LineasD.length = 0;
		NodosD.length = 0;
		TextoD.length = 0;
		// Preparamos los elementos a dibujar 
		for (var i = 0; i < Lista.length; i++) { 
			  Color = Colores[Lista[i].Prof%8];
			  LineasD.push([Lista[i].XPadre,Lista[i].YPadre,Lista[i].X,Lista[i].Y,Color])
			  NodosD.push([Lista[i].XPadre, Lista[i].YPadre, Lista[i].Radio,Color,Lista[i].TieneHijos ? 3 : 2])
			  xT = (Lista[i].XPadre * Math.cos(rot) - Lista[i].YPadre * Math.sin(rot)) + Lista[i].Radio + 4;
			  yT = (Lista[i].XPadre * Math.sin(rot) + Lista[i].YPadre * Math.cos(rot)) - 6;
			  TextoD.push([Lista[i].Nombre+": "+Lista[i].Prof,xT,yT]);}
		// Preparamos el contexto del canvas
		limpiar();
		context.save();
		context.translate(trns.x, trns.y);
		context.rotate(rot);
		context.scale(esc, esc);
		// Líneas (Antes que los nodos, así no solapan)
		for (var i = 0; i < LineasD.length; i++) {
			context.beginPath();
			context.lineWidth = 1;
			context.moveTo(LineasD[i][0],LineasD[i][1]);
			context.lineTo(LineasD[i][2],LineasD[i][3]);
			context.strokeStyle = LineasD[i][4]; // 8 Colores, ciclos
			context.stroke();}
		// Nodos
		for (var i = 0; i < NodosD.length; i++) {
			context.beginPath();
			context.arc(NodosD[i][0], NodosD[i][1], NodosD[i][2], 0, 2 * Math.PI, false);
			context.fillStyle = NodosD[i][3]; 
			context.fill();
			context.lineWidth = NodosD[i][4];
			context.strokeStyle = 'black';
			context.stroke();}
		// Texto (Opcional)
		if (Ver)
		for (var i = 0; i < TextoD.length; i++) {
			context.fillStyle = 'black';
			context.font = '12px san-serif';
			context.rotate(-rot);
			context.fillText(TextoD[i][0], TextoD[i][1], TextoD[i][2]);
			context.rotate(rot);}
		context.restore();
	}
	
	/* ANALISIS DE LA ENTRADA Y PREPARACION DE VARIABLES */
	
	function Analizar(){
		$("#btnAnalizar").button('loading');
		// Restauramos los arrays
		NodosDibujar.length = 0;
		LineasD.length = 0;
		NodosD.length = 0;
		TextoD.length = 0;
		tProf=0;tPadres=0;
		UserInput = $("#raiz").val(); 

		if (UserInput[0]=="{") JSInput = true;
		else if (UserInput[0]=="[") JSInput = false;
		else {$("#a_info").html('<div style="margin-top:12px;" class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times;</a><strong><h5>Error:</strong></h5>Entrada no reconocida. Utilice Arrays "[0,1,[2,3,[4,5]],6]" o JSON con campos NAME y CHILDREN "{"Name":"Root","Children":[{"Name":"Child 1","Children":[]},{"Name":"Child 2","Children":[]},{"Name":"Child 3","Children":[]}]}"</div>'); $("#btnAnalizar").button('reset'); return;}

		Raiz = JSInput ? new Nodo(JSON.parse(UserInput).Name,JSON.parse(UserInput).Children,0,0,0,0,0,0,false,20) : new Nodo("Raiz",JSON.parse(UserInput),0,0,0,0,0,0,false,20);		
		NodosProcesables.push(Raiz);
		NodosDibujar.push(Raiz);
		ProcesarNodo(Raiz,JSInput);
	}
	
	/* ESTADISTICAS DEL ARBOL DE NODOS */
	
	function Estadisticas() {
		$("#btnAnalizar").button('reset');
		$("#btnDibujar").removeClass('disabled');
	    tNodos = NodosDibujar.length;
		tEnlaces = (tNodos-1);
		$("#a_info").html('<div style="margin-top:12px;" class="alert alert-success"><a class="close" data-dismiss="alert" href="#">&times;</a><strong><h5>¡Análisis Completo!</strong></h5>Número de Nodos: '+tNodos+'<br/>Nodos con Hijos: '+tPadres+'<br/>Profundidad Máxima: '+tProf+'<br/>Nº de Enlaces: '+tEnlaces+'</div>');
	}
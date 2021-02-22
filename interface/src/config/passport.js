import axios from 'axios'
import jsPDF from 'jspdf' 
const h = require("@/config/hosts").hostAPI
var passport = new jsPDF();
var limpares = 0;


    
export const Passaport = {
    getPassaporteTurma: function(turma, codigoProfessor, agrupamento){
        passport = new jsPDF();
        var pdfName = "Passaporte-" + turma + ".pdf"
        var token = localStorage.getItem("token")
        
        axios.get(h + "turmas/" + turma + "/alunos/?codprofessor=" + codigoProfessor + "&token=" + token)
            .then(dados =>{
                var alunos = dados.data
                for (var i = 1; i <= alunos.length; i++) {
                    var aluno = alunos[i-1]
                    console.log(aluno)
                    passportToPdf(i, aluno.nome, agrupamento, aluno.user, aluno.numero.toString(), aluno.turma ,"");
                }
                
                passport.save(pdfName);
            })
            .catch(error => console.log(error))
    }
};

// a = nome  ; b = escola  ; c = user ; d = numero  ; e = turma ; f =   
function passportToPdf(i,a,b,c,d,e,f) {
	var inc1 = 70;
	var imgData = 'data:image/png;base64,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';
	
	console.log(i + " ; " + a + " ; " + b + " ; " + c + " ; " + d + " ; " + e + " ; " + f);
	
	if (i % 2 != 0) {
		
		
		passport.setTextColor(102, 102, 102);
		passport.setFontSize(11);
        passport.setFont("helvetica", "bold")		
        passport.text(81, 32+((i%4) - 1)*inc1, "20"+(e.split("-")[1]-1)+"/20"+(e.split("-")[1]));
		
		passport.addImage(imgData, 'PNG', 16, 29+((i%4) - 1)*inc1, 25, 7.5);
		passport.setDrawColor(0, 0, 0);
		passport.rect(14, 28+((i%4) - 1)*inc1, 88, 88);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(10);
        passport.setFont("helvetica", "bold")		
		passport.text(61, 38+((i%4) - 1)*inc1, 'PARA ALUNOS E PAIS');
		passport.setFontSize(16);
		passport.setTextColor(51, 153, 0);
		passport.text(19, 48+((i%4) - 1)*inc1, 'PASSAPORTE HYPATIAMAT');
		passport.setDrawColor(204,204,204);
		passport.rect(19, 51+((i%4) - 1)*inc1, 20, 5);passport.rect(39, 51+((i%4) - 1)*inc1, 58, 5);
        passport.setFont("helvetica", "bold")		
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(20, 55+((i%4) - 1)*inc1, 'Nome:'); 
		passport.setFontSize(7);
		passport.setTextColor(0, 0, 0);
		passport.text(40, 55+((i%4) - 1)*inc1, a);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		passport.rect(19, 56+((i%4) - 1)*inc1, 20, 5);passport.rect(39, 56+((i%4) - 1)*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		
		passport.text(20, 60+((i%4) - 1)*inc1, 'Ano:');
		passport.setFontSize(7);
		passport.setTextColor(0, 0, 0);
		passport.text(40, 60+((i%4) - 1)*inc1, (e.split("-")[0]).split("")[0]+".º ano da turma " + e);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		passport.text(86, 60+((i%4) - 1)*inc1, "N.º ");
		passport.setTextColor(0, 0, 0);
		passport.text(92, 60+((i%4) - 1)*inc1, d);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		
		passport.rect(19, 61+((i%4) - 1)*inc1, 20, 5);passport.rect(39, 61+((i%4) - 1)*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(20, 65+((i%4) - 1)*inc1, 'Escola:');
        if(b.length <= 43) passport.setFontSize(7);
        else passport.setFontSize(6);
		passport.setTextColor(0, 0, 0);
		passport.text(40, 65+((i%4) - 1)*inc1, b);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		
		passport.rect(19, 71+((i%4) - 1)*inc1, 20, 5);passport.rect(39, 71+((i%4) - 1)*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(20, 75+((i%4) - 1)*inc1, 'Utilizador:');
		passport.setFontSize(7);
		passport.setTextColor(0, 0, 0);
		passport.text(40, 75+((i%4) - 1)*inc1, c);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		passport.rect(19, 76+((i%4) - 1)*inc1, 20, 5);passport.rect(39, 76+((i%4) - 1)*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(20, 80+((i%4) - 1)*inc1, 'Password:');
		passport.setTextColor(51, 153, 0);
		passport.text(20, 88+((i%4) - 1)*inc1, 'Links úteis:');
		passport.text(30, 92+((i%4) - 1)*inc1, 'URL:');
		passport.setTextColor(0, 51, 153);
        passport.setFont("normal", "normal")		
		passport.text(39, 92+((i%4) - 1)*inc1, 'www.hypatiamat.com');
		passport.setTextColor(51, 153, 0);
        passport.setFont("helvetica", "bold")		
		passport.text(30, 96+((i%4) - 1)*inc1, 'Facebook:');
		passport.setTextColor(0, 51, 153);
        passport.setFont("normal", "normal")		
		passport.text(47, 96+((i%4) - 1)*inc1, 'www.facebook.com/hypatiamat');
		
		
		passport.setFillColor(224, 245, 224);
		passport.rect(16, 101+((i%4) - 1)*inc1, 84, 6, 'F');

        passport.setFont("times", "bolditalic")		
		passport.setTextColor(0, 51, 0);
		passport.setFontSize(10);
		passport.text(17, 105+((i%4) - 1)*inc1, '"A persistência é o caminho do êxito."');
		passport.setFontSize(6);
		passport.text(82, 105.5+((i%4) - 1)*inc1, 'Charles Chaplin');
	} else {
		passport.setTextColor(102, 102, 102);
		passport.setFontSize(11);
        passport.setFont("helvetica", "bold")		
		passport.text(175, 32+limpares*inc1, "20"+(e.split("-")[1]-1)+"/20"+(e.split("-")[1]));
		
		passport.addImage(imgData, 'PNG', 110, 29+limpares*inc1, 25, 7.5);
		passport.setDrawColor(0, 0, 0);
		passport.rect(108, 28+limpares*inc1, 88, 88);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(10);
        passport.setFont("helvetica", "bold")		
		passport.text(155, 38+limpares*inc1, 'PARA ALUNOS E PAIS');
		passport.setFontSize(16);
		passport.setTextColor(51, 153, 0);
		passport.text(113, 48+limpares*inc1, 'PASSAPORTE HYPATIAMAT');
		passport.setDrawColor(204,204,204);
		passport.rect(113, 51+limpares*inc1, 20, 5);passport.rect(133, 51+limpares*inc1, 58, 5);
        passport.setFont("helvetica", "bold")		
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(114, 55+limpares*inc1, 'Nome:'); 
		passport.setFontSize(7);
		passport.setTextColor(0, 0, 0);
		passport.text(134, 55+limpares*inc1, a);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		passport.rect(113, 56+limpares*inc1, 20, 5);passport.rect(133, 56+limpares*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		
		passport.text(114, 60+limpares*inc1, 'Ano:');
		passport.setFontSize(7);
		passport.setTextColor(0, 0, 0);
		passport.text(134, 60+limpares*inc1, (e.split("-")[0]).split("")[0]+".º ano da turma " + e);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		passport.text(180, 60+limpares*inc1, "N.º ");
		passport.setTextColor(0, 0, 0);
		passport.text(186, 60+limpares*inc1, d);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		
		passport.rect(113, 61+limpares*inc1, 20, 5);passport.rect(133, 61+limpares*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(114, 65+limpares*inc1, 'Escola:');
		if(b.length <= 43) passport.setFontSize(7);
        else passport.setFontSize(6);
		passport.setTextColor(0, 0, 0);
		passport.text(134, 65+limpares*inc1, b);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		
		passport.rect(113, 71+limpares*inc1, 20, 5);passport.rect(133, 71+limpares*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(114, 75+limpares*inc1, 'Utilizador:');
		passport.setFontSize(7);
		passport.setTextColor(0, 0, 0);
		passport.text(134, 75+limpares*inc1, c);
		passport.setTextColor(102, 204, 102);
		passport.setFontSize(9);
		passport.rect(113, 76+limpares*inc1, 20, 5);passport.rect(133, 76+limpares*inc1, 58, 5);
		passport.setFontSize(9);
		passport.setTextColor(102, 204, 102);
		passport.text(114, 80+limpares*inc1, 'Password:');
		passport.setTextColor(51, 153, 0);
		passport.text(114, 88+limpares*inc1, 'Links úteis:');
		passport.text(124, 92+limpares*inc1, 'URL:');
		passport.setTextColor(0, 51, 153);
        passport.setFont("normal", "normal")		
		passport.text(133, 92+limpares*inc1, 'www.hypatiamat.com');
		passport.setTextColor(51, 153, 0);
        passport.setFont("helvetica", "bold")		
		passport.text(124, 96+limpares*inc1, 'Facebook:');
		passport.setTextColor(0, 51, 153);
        passport.setFont("normal", "normal")		
		passport.text(141, 96+limpares*inc1, 'www.facebook.com/hypatiamat');
		
		
		passport.setFillColor(224, 245, 224);
		passport.rect(110, 101+limpares*inc1, 84, 6, 'F');

        passport.setFont("times", "bolditalic")		
		passport.setTextColor(0, 51, 0);
		passport.setFontSize(10);
		passport.text(111, 105+limpares*inc1, '"A persistência é o caminho do êxito."');
		passport.setFontSize(6);
		passport.text(176, 105.5+limpares*inc1, 'Charles Chaplin');
		
		if (limpares == 0) {
			limpares = 2;
		} else {
			limpares = 0;
		}
	}
	
	if (i % 4 == 0 && i > 1) { passport.addPage(); }
}


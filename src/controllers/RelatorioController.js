const excel = require("exceljs");
const moment = require("moment");
const Anuncio = require('../models/AnuncioSchema');
const ChatRoom = require('../models/ChatRoomSchema');

/**
 * gera lista com dados sobre todos os anúncios
 */
const generateRelatorio = async (id) => {
  let relatorio = [];
  let rooms = await ChatRoom.find()
  await Anuncio.find({ userId: id })
    .then((anuncios) => {
      anuncios = anuncios.sort(function (a, b) {
        return b.numVisitas - a.numVisitas;
      }).map(function (e, i) {
        e.rank = (i + 1);
        return e;
      });


      anuncios.forEach((anu) => {
        let total = 0;

        for (let room of rooms) {
          if (room.anuncioId.toString() === anu._id.toString()) {
            total = total + room.mensagens.length
          }
          total = total
        }
        if (anu.userId.toString() === id) {

          let diasPublicados = Math.round(moment.duration(Date.now() - anu.dataPublicacao).asDays())
          let medVisitasDia

          if (diasPublicados < 1) {
            medVisitasDia = anu.numVisitas
          } else {
            medVisitasDia = Math.round((anu.numVisitas / diasPublicados) * 10) / 10
          }

          let primeiraVisita = Math.round(moment.duration(anu.primeiraVisita - anu.dataPublicacao).asDays())
          if (primeiraVisita < 1) {
            primeiraVisita = 0
          } else if (isNaN(primeiraVisita)) {
            primeiraVisita = "Nunca visitado"
          } else {
            primeiraVisita = primeiraVisita
          }

          let primeiroContato = Math.round(moment.duration(anu.primeiroContato - anu.dataPublicacao).asDays())
          if (primeiroContato < 1) {
            primeiroContato = 0
          } else if (isNaN(primeiroContato)) {
            primeiroContato = "Nunca contatado"
          } else {
            primeiroContato = primeiroContato
          }

          relatorio.push({
            id: anu._id,
            rank: anu.rank,
            nome: anu.veiculoMarca + " " + anu.descricaoVeiculo + " " + anu.anoModelo,
            dataPublicacao: anu.dataPublicacao,
            dataAlteracao: anu.dataAlteracao,
            numVisitas: anu.numVisitas,
            dataPrimeiraVisita: anu.primeiraVisita || "Nunca visitado",
            primeiraVisita: primeiraVisita,
            medVisitasDia: medVisitasDia,
            numContatos: anu.numContatos,
            dataPrimeiroContato: anu.primeiroContato || "Nunca contatado",
            primeiroContato: primeiroContato,
            totalMensagens: total
          });
        }
      });
    })
  return relatorio
}

module.exports = {

  /**
   * retorna relatório em arquivo excel
   */
  async getExcel(request, response) {

    try {

      const { userId } = request;

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Relatório");

      worksheet.columns = [
        { header: "Rank", key: "rank", width: 25 },
        { header: "Nome", key: "nome", width: 25 },
        { header: "Data de publicação", key: "dataPublicacao", width: 25 },
        { header: "Data da última alteração", key: "dataAlteracao", width: 25 },
        { header: "Número de visitas", key: "numVisitas", width: 25 },
        { header: "Data da primeira visita", key: "dataPrimeiraVisita", width: 25 },
        { header: "Tempo até a primeira visita", key: "primeiraVisita", width: 30 },
        { header: "Média de visitas diárias", key: "medVisitasDia", width: 30 },
        { header: "Número de contatos", key: "numContatos", width: 25 },
        { header: "Data do primeiro contato", key: "dataPrimeiroContato", width: 25 },
        { header: "Tempo até o primeiro contato", key: "primeiroContato", width: 30 },
        { header: "Total de mensagens trocadas", key: "totalMensagens", width: 30 },
      ];

      let relatorio = await generateRelatorio(userId)

      worksheet.addRows(relatorio);

      response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      response.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "relatorio.xlsx"
      );

      return workbook.xlsx.write(response).then(function () {
        response.status(200).end();
      });
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  },

  /**
   * retorna relatório em Json
   */
  async getJson(request, response) {
    try {
      const { userId } = request;
      let relatorio = await generateRelatorio(userId)
      return response.json({ relatorio });
    } catch (e) {
      console.log(e.message)
      return response.send({ message: e.message })
    }
  }

}
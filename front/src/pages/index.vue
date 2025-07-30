<template>
  <v-container class="calendar-container">
    <h1 class="text-center mb-4 calendar-title">
      ✨ Calendário de Ministrações Redime ✨
    </h1>

    <v-sheet class="pa-4 calendar-sheet" rounded="xl" elevation="4">
      <div class="d-flex align-center justify-space-between mb-4">
        <v-btn icon @click="previousMonth" class="nav-button" size="small">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <h2 class="text-h6 text-sm-h5 current-month-year">{{ currentMonthYear }}</h2>
        <v-btn icon @click="nextMonth" class="nav-button" size="small">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <v-divider class="mb-3 calendar-divider"></v-divider>

      <v-row class="text-center font-weight-bold week-days-row no-gutters">
        <v-col v-for="day in weekDays" :key="day" class="py-2 mb-5 week-day-header">
          {{ day.substring(0, 3) }}
        </v-col>
      </v-row>

      <v-divider class="calendar-divider"></v-divider>

      <v-row
        v-for="(week, weekIndex) in calendarWeeks"
        :key="weekIndex"
        class="calendar-week no-gutters"
      >
        <v-col
          v-for="(dayInfo, dayIndex) in week"
          :key="dayIndex"
          class="calendar-day d-flex flex-column align-center justify-start pa-1"
          :class="{
            'text-grey-lighten-1': !dayInfo.isCurrentMonth,
            'current-day': dayInfo.isToday,
            'has-events': getEventsForDay(dayInfo.date).length > 0,
          }"
          @click="openAddEventDialog(dayInfo.date)"
        >
          <div class="text-subtitle-2 day-number">{{ dayInfo.day }}</div>
          <div class="events mt-1">
            <template v-for="event in getEventsForDay(dayInfo.date)" :key="event.id">
              <v-chip
                :color="event.color"
                density="compact"
                class="mb-1 event-chip"
                @click.stop="showEventDetails(event)"
                label
              >
                {{ event.name }}
              </v-chip>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-sheet
      class="pa-4 mt-4 event-details-sheet"
      rounded="xl"
      elevation="4"
      v-if="Object.keys(selectedEvent).length > 0"
    >
      <v-card-title class="text-h6 event-details-title">{{
        selectedEvent.name
      }}</v-card-title>
      <v-card-text class="event-details-text">
        <p class="mb-2"><strong>Data:</strong> {{ selectedEvent.date }}</p>
        <p><strong>Descrição:</strong> {{ selectedEvent.description }}</p>
        <p v-if="selectedEvent.people && selectedEvent.people.length > 0">
          <strong>Pessoas:</strong> {{ selectedEvent.people.join(", ") }}
        </p>
      </v-card-text>
    </v-sheet>

    <v-sheet
      class="pa-4 mt-4 event-details-sheet text-center"
      rounded="xl"
      elevation="4"
      v-else
    >
      <p class="text-subtitle-1 text-grey-darken-1">Nenhum evento escolhido ainda...</p>
    </v-sheet>

    <v-dialog v-model="addEventDialog" max-width="500px">
      <v-card class="add-event-dialog-title" rounded="lg" elevation="8">
        <v-card-title class="text-h6 add-event-dialog-title">
          Novo Evento em {{ newEvent.date }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEvent.name"
            label="Nome do Evento"
            variant="outlined"
            density="compact"
            class="mb-3"
          ></v-text-field>
          <v-textarea
            v-model="newEvent.description"
            label="Descrição"
            variant="outlined"
            density="compact"
            rows="3"
            class="mb-3"
          ></v-textarea>
          <v-text-field
            v-model="newEvent.people"
            label="Pessoas Selecionadas"
            variant="outlined"
            density="compact"
          ></v-text-field>
          <v-select
            v-model="newEvent.color"
            :items="availableColors"
            label="Cor do Evento"
            variant="outlined"
            density="compact"
            item-title="text"
            item-value="value"
            class="mt-3"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item.raw.text">
                <template v-slot:prepend>
                  <v-icon :color="item.raw.value">mdi-circle</v-icon>
                </template>
              </v-list-item>
            </template>
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="red" @click="addEventDialog = false"
            >Cancelar</v-btn
          >
          <v-btn variant="flat" color="#6A1B9A" @click="saveNewEvent">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export default defineComponent({
  name: "CalendarScreen",
  data() {
    return {
      currentDate: moment(),
      weekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      events: [
        {
          id: 1,
          name: "Reunião de Equipe",
          date: "2025-07-15",
          description: "Reunião semanal para discutir o progresso do projeto.",
          color: "blue-lighten-2",
          people: ["João", "Maria"],
        },
        {
          id: 2,
          name: "Lançamento do Produto",
          date: "2025-07-28",
          description: "Evento de lançamento do nosso novo produto.",
          color: "green-lighten-2",
          people: ["Carlos", "Ana", "Pedro"],
        },
        {
          id: 3,
          name: "Feriado",
          date: "2025-07-04",
          description: "Feriado nacional.",
          color: "red-lighten-2",
          people: [],
        },
        {
          id: 4,
          name: "Workshop de Vue",
          date: "2025-08-10",
          description: "Workshop prático sobre Vue 3 e Vuetify.",
          color: "purple-lighten-2",
          people: ["Paula"],
        },
        {
          id: 5,
          name: "Consulta Médica",
          date: "2025-07-28",
          description: "Consulta de rotina com o Dr. Silva.",
          color: "orange-lighten-2",
          people: ["Dr. Silva"],
        },
      ],
      selectedEvent: {},
      addEventDialog: false,
      newEvent: {
        name: "",
        date: "",
        description: "",
        color: "blue-lighten-2",
        people: "",
      },
      availablePeople: [
        "João",
        "Maria",
        "Carlos",
        "Ana",
        "Pedro",
        "Paula",
        "Lucas",
        "Mariana",
        "Dr. Silva",
      ],
      availableColors: [
        { text: "Azul Claro", value: "blue-lighten-2" },
        { text: "Verde Claro", value: "green-lighten-2" },
        { text: "Vermelho Claro", value: "red-lighten-2" },
        { text: "Roxo Claro", value: "purple-lighten-2" },
        { text: "Laranja Claro", value: "orange-lighten-2" },
        { text: "Rosa Claro", value: "pink-lighten-2" },
      ],
    };
  },
  computed: {
    currentMonthYear() {
      const formatter = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      });

      const formattedDate = formatter.format(this.currentDate.toDate());
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    },
    calendarWeeks() {
      const startOfMonth = this.currentDate.clone().startOf("month");
      const endOfMonth = this.currentDate.clone().endOf("month");
      const startDay = startOfMonth.clone().startOf("week");
      const endDay = endOfMonth.clone().endOf("week");

      const weeks = [];
      let day = startDay.clone();

      while (day.isSameOrBefore(endDay, "day")) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          week.push({
            day: day.date(),
            date: day.format("YYYY-MM-DD"),
            isCurrentMonth: day.month() === this.currentDate.month(),
            isToday: day.isSame(moment(), "day"),
          });
          day.add(1, "day");
        }
        weeks.push(week);
      }
      return weeks;
    },
  },
  methods: {
    previousMonth() {
      this.currentDate = this.currentDate.clone().subtract(1, "month");
      this.selectedEvent = {};
    },
    nextMonth() {
      this.currentDate = this.currentDate.clone().add(1, "month");
      this.selectedEvent = {};
    },
    getEventsForDay(date) {
      return this.events.filter((event) => event.date === date);
    },
    showEventDetails(event) {
      this.selectedEvent = event;
    },
    openAddEventDialog(date) {
      this.newEvent = {
        name: "",
        date: date,
        description: "",
        color: "blue-lighten-2",
        people: [],
      };
      this.addEventDialog = true;
    },
    async saveNewEvent() {
      try {
        await this.HTTP("post", "ministracoes/add-ministracao", this.newEvent);

        this.addEventDialog = false;

        this.newEvent = {
          name: "",
          date: "",
          description: "",
          color: "blue-lighten-2",
          people: "",
        };
        this.$root.showToast("Ministração adicionada com sucesso!", "success");
      } catch (error) {
        console.error(error);
        this.$root.showToast("Erro ao adicionar ministração.");
      }
    },
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap");

.calendar-container {
  font-family: "Quicksand", sans-serif;
  padding: 15px;
  background: linear-gradient(to bottom right, #fce4ec, #e0f2f7);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.calendar-title {
  color: #880e4f;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 1.1rem !important;
  margin-bottom: 1rem !important;
}

.calendar-sheet {
  background-color: #ffffff;
  border-radius: 20px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
  width: 100%;
  max-width: 500px;
  max-height: 600px;
}

.nav-button {
  background-color: #f8bbd0 !important;
  color: #ffffff !important;
  border-radius: 50% !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 36px !important;
  height: 36px !important;
}

.nav-button:hover {
  background-color: #f48fb1 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.current-month-year {
  color: #4a148c;
  font-weight: 500;
  font-size: 1.2rem !important;
}

.calendar-divider {
  border-color: rgba(248, 187, 208, 0.5) !important;
}

.week-days-row {
  color: #6a1b9a;
  font-weight: 700 !important;
}

.week-day-header {
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 0.8rem;
}

.calendar-week {
  border-bottom: 1px solid rgba(248, 187, 208, 0.3);
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-day {
  min-height: 80px;
  border-right: 1px solid rgba(248, 187, 208, 0.3);
  padding: 4px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;
  cursor: pointer; /* Adiciona um cursor de ponteiro para indicar que é clicável */
}

.calendar-day:last-child {
  border-right: none;
}

.day-number {
  color: #424242;
  font-weight: 500;
  font-size: 0.9rem !important;
}

.text-grey-lighten-1 {
  color: #bdbdbd !important;
}

.current-day {
  background-color: #ffebee;
  border-radius: 8px;
  box-shadow: inset 0 0 8px rgba(248, 187, 208, 0.3);
}

.calendar-day.has-events {
  background-color: #f3e5f5;
}

.event-chip {
  border-radius: 12px !important;
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  padding: 2px 6px !important;
  height: auto !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
}

.event-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  opacity: 0.9;
}

.events {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.event-details-sheet {
  background: linear-gradient(to top left, #fffde7, #f0f4c3);
  width: 100%;
  height: 230px; /* Mantive a altura para ocupar o espaço consistentemente */
  max-width: 500px;
  display: flex; /* Para centralizar o texto "Nenhum evento escolhido ainda..." */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center; /* Garante que o texto esteja centralizado */
}

.event-details-title {
  color: #7b1fa2;
  font-weight: 700;
  text-align: center;
  padding-bottom: 8px;
  font-size: 1.2rem !important;
}

.event-details-text {
  color: #424242;
  font-size: 0.9rem;
  line-height: 1.5;
}

.event-details-text strong {
  color: #ad1457;
}

/* Estilos para o novo diálogo de adicionar evento */
.add-event-dialog-title {
  color: #6a1b9a;
  font-weight: 700;
  text-align: center;
  padding-bottom: 10px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(248, 187, 208, 0.5);
}

.v-card-actions .v-btn {
  font-weight: 600;
}
</style>

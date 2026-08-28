export interface KotlinFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/soportetecnico/app/MainActivity.kt',
    description: 'Punto de entrada principal de la aplicación Android con Jetpack Compose.',
    code: `package com.soportetecnico.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.soportetecnico.app.ui.SoporteTecnicoApp
import com.soportetecnico.app.ui.theme.SoporteTecnicoTheme
import com.soportetecnico.app.viewmodel.SupportViewModel

/**
 * Actividad Principal de la aplicación Android "Soporte Técnico".
 * Configura el tema de Material 3 y lanza el árbol composable principal.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SoporteTecnicoTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // ViewModel con estado en memoria compartido entre cliente y técnico
                    val viewModel: SupportViewModel = viewModel()
                    SoporteTecnicoApp(viewModel = viewModel)
                }
            }
        }
    }
}
`
  },
  {
    name: 'Models.kt',
    path: 'app/src/main/java/com/soportetecnico/app/model/Models.kt',
    description: 'Modelos de datos para tickets, soluciones y categorías de problemas.',
    code: `package com.soportetecnico.app.model

import java.util.UUID

/**
 * Opciones de problemas solicitadas para el cliente.
 */
enum class ProblemCategory(val displayName: String) {
    INTERNET("Internet"),
    COMPUTADOR_LENTO("Computador lento"),
    SIN_SONIDO("Sin sonido"),
    PANTALLA("Pantalla"),
    VIRUS("Virus"),
    WINDOWS("Windows"),
    OTRO("Otro")
}

/**
 * Estados del reporte de soporte técnico.
 */
enum class TicketStatus(val displayName: String) {
    PENDIENTE("Pendiente"),
    EN_DIAGNOSTICO("En diagnóstico"),
    SOLUCIONADO("Solucionado")
}

/**
 * Estado de retroalimentación del cliente respecto a una solución.
 */
enum class SolutionFeedback {
    NONE,
    WORKED,
    DID_NOT_WORK
}

/**
 * Modelo de una solución enviada por el técnico.
 * Contiene: Título, Descripción y Pasos a realizar.
 */
data class Solution(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val steps: List<String>,
    val createdAt: String,
    val feedback: SolutionFeedback = SolutionFeedback.NONE,
    val feedbackComment: String = ""
)

/**
 * Modelo principal de un Reporte / Ticket de problema del computador.
 */
data class Ticket(
    val id: String = UUID.randomUUID().toString().take(8).uppercase(),
    val clientName: String,
    val clientDevice: String = "PC / Laptop",
    val category: ProblemCategory,
    val description: String,
    val createdAt: String,
    val status: TicketStatus = TicketStatus.PENDIENTE,
    val technicianResponse: String = "",
    val solutions: List<Solution> = emptyList()
)
`
  },
  {
    name: 'SupportViewModel.kt',
    path: 'app/src/main/java/com/soportetecnico/app/viewmodel/SupportViewModel.kt',
    description: 'Gestión de estado local y reactivo entre Cliente y Técnico.',
    code: `package com.soportetecnico.app.viewmodel

import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import com.soportetecnico.app.model.*

/**
 * Pantallas de navegación en la app
 */
enum class AppScreen {
    HOME,
    CLIENT_FORM,
    CLIENT_TICKET_DETAIL,
    TECHNICIAN_LIST,
    TECHNICIAN_DETAIL
}

/**
 * ViewModel que almacena y gestiona los datos de los tickets en memoria local.
 */
class SupportViewModel : ViewModel() {

    // Pantalla actual
    var currentScreen = mutableStateOf(AppScreen.HOME)
        private set

    // Ticket actualmente seleccionado para ver detalle
    var selectedTicketId = mutableStateOf<String?>(null)
        private set

    // Lista observable de tickets
    val tickets = mutableStateListOf<Ticket>()

    init {
        // Datos simulados iniciales para probar el prototipo de inmediato
        loadMockData()
    }

    private fun loadMockData() {
        tickets.add(
            Ticket(
                id = "TICK-101",
                clientName = "Carlos Mendoza",
                clientDevice = "Laptop Lenovo ThinkPad",
                category = ProblemCategory.INTERNET,
                description = "El computador no detecta las redes Wi-Fi desde esta mañana.",
                createdAt = "Hoy 10:30 AM",
                status = TicketStatus.EN_DIAGNOSTICO,
                technicianResponse = "Hola Carlos, parece un desajuste del controlador de red tras una actualización.",
                solutions = listOf(
                    Solution(
                        id = "SOL-1",
                        title = "Reinicio de servicios de red WLAN",
                        description = "Reiniciar el servicio encargado de la búsqueda de redes en Windows.",
                        steps = listOf(
                            "Presiona Windows + R, escribe 'services.msc' y pulsa Enter.",
                            "Busca 'Configuración automática de WLAN'.",
                            "Haz clic derecho y selecciona 'Reiniciar'."
                        ),
                        createdAt = "Hoy 11:00 AM",
                        feedback = SolutionFeedback.DID_NOT_WORK,
                        feedbackComment = "Se reinició el servicio pero sigue sin detectar redes."
                    ),
                    Solution(
                        id = "SOL-2",
                        title = "Reinstalar controlador de red",
                        description = "Desinstalar el controlador corrupto para que Windows lo reinstale.",
                        steps = listOf(
                            "Abre el Administrador de Dispositivos.",
                            "Despliega 'Adaptadores de red'.",
                            "Haz clic derecho en tu tarjeta Wi-Fi y selecciona 'Desinstalar'.",
                            "Reinicia el equipo por completo."
                        ),
                        createdAt = "Hoy 11:30 AM",
                        feedback = SolutionFeedback.WORKED,
                        feedbackComment = "¡Funcionó perfecto! Ya tengo conexión a Internet."
                    )
                )
            )
        )
    }

    // Funciones de navegación
    fun navigateTo(screen: AppScreen, ticketId: String? = null) {
        selectedTicketId.value = ticketId
        currentScreen.value = screen
    }

    // Acción del Cliente: Crear y enviar un nuevo problema
    fun submitTicket(clientName: String, category: ProblemCategory, description: String, device: String) {
        val newTicket = Ticket(
            clientName = clientName.ifBlank { "Cliente Anónimo" },
            clientDevice = device.ifBlank { "Computador" },
            category = category,
            description = description,
            createdAt = "Hace un momento",
            status = TicketStatus.PENDIENTE
        )
        tickets.add(0, newTicket)
        // Navega al detalle del ticket recién creado
        navigateTo(AppScreen.CLIENT_TICKET_DETAIL, newTicket.id)
    }

    // Acción del Cliente: Enviar retroalimentación sobre si una solución funcionó
    fun setSolutionFeedback(ticketId: String, solutionId: String, feedback: SolutionFeedback, comment: String = "") {
        val index = tickets.indexOfFirst { it.id == ticketId }
        if (index != -1) {
            val ticket = tickets[index]
            val updatedSolutions = ticket.solutions.map { sol ->
                if (sol.id == solutionId) sol.copy(feedback = feedback, feedbackComment = comment) else sol
            }
            // Si funcionó, podemos sugerir marcarlo solucionado
            val newStatus = if (feedback == SolutionFeedback.WORKED) TicketStatus.SOLUCIONADO else ticket.status
            tickets[index] = ticket.copy(solutions = updatedSolutions, status = newStatus)
        }
    }

    // Acción del Técnico: Responder y agregar una nueva solución
    fun addSolutionToTicket(ticketId: String, technicianResponse: String, solutionTitle: String, solutionDesc: String, steps: List<String>) {
        val index = tickets.indexOfFirst { it.id == ticketId }
        if (index != -1) {
            val ticket = tickets[index]
            val newSolution = Solution(
                title = solutionTitle,
                description = solutionDesc,
                steps = steps.filter { it.isNotBlank() },
                createdAt = "Hace un momento"
            )
            tickets[index] = ticket.copy(
                technicianResponse = technicianResponse.ifBlank { ticket.technicianResponse },
                status = if (ticket.status == TicketStatus.PENDIENTE) TicketStatus.EN_DIAGNOSTICO else ticket.status,
                solutions = ticket.solutions + newSolution
            )
        }
    }

    // Acción del Técnico: Actualizar estado del ticket
    fun updateTicketStatus(ticketId: String, newStatus: TicketStatus) {
        val index = tickets.indexOfFirst { it.id == ticketId }
        if (index != -1) {
            tickets[index] = tickets[index].copy(status = newStatus)
        }
    }
}
`
  },
  {
    name: 'HomeScreen.kt',
    path: 'app/src/main/java/com/soportetecnico/app/ui/HomeScreen.kt',
    description: 'Pantalla inicial con título "Soporte Técnico" y botones "Cliente" y "Técnico".',
    code: `package com.soportetecnico.app.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Computer
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.soportetecnico.app.viewmodel.AppScreen

/**
 * Pantalla principal requerida:
 * - Mostrar el título "Soporte Técnico"
 * - Dos botones: "Cliente" y "Técnico"
 */
@Composable
fun HomeScreen(
    onNavigate: (AppScreen) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Icono representativo de soporte
        Surface(
            modifier = Modifier.size(88.dp),
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.primaryContainer
        ) {
            Icon(
                imageVector = Icons.Default.Computer,
                contentDescription = "Icono Soporte",
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier
                    .padding(20.dp)
                    .fillMaxSize()
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Título Principal
        Text(
            text = "Soporte Técnico",
            style = MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )

        Text(
            text = "Soluciones rápidas y efectivas para problemas de computadores",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
        )

        Spacer(modifier = Modifier.height(40.dp))

        // Botón "Cliente"
        Button(
            onClick = { onNavigate(AppScreen.CLIENT_FORM) },
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
            Icon(imageVector = Icons.Default.Person, contentDescription = null)
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "Cliente",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Botón "Técnico"
        OutlinedButton(
            onClick = { onNavigate(AppScreen.TECHNICIAN_LIST) },
            modifier = Modifier
                .fillMaxWidth()
                .height(60.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.outlinedButtonColors()
        ) {
            Icon(imageVector = Icons.Default.Build, contentDescription = null)
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "Técnico",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
`
  },
  {
    name: 'ClientScreens.kt',
    path: 'app/src/main/java/com/soportetecnico/app/ui/ClientScreens.kt',
    description: 'Vistas del modo Cliente: formulario de reporte y seguimiento con soluciones y feedback.',
    code: `package com.soportetecnico.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.soportetecnico.app.model.*
import com.soportetecnico.app.viewmodel.AppScreen
import com.soportetecnico.app.viewmodel.SupportViewModel

/**
 * Modo Cliente: Formulario para escribir el problema y seleccionar categoría.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClientFormScreen(
    viewModel: SupportViewModel,
    onBack: () -> Unit
) {
    var clientName by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(ProblemCategory.INTERNET) }
    var description by remember { mutableStateOf("") }
    var device by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Reportar Problema") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "¿Qué problema presenta tu computador?",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            // Opciones de problemas requeridas
            item {
                Text("Selecciona el tipo de problema:", style = MaterialTheme.typography.bodyMedium)
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    ProblemCategory.values().forEach { category ->
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .clickable { selectedCategory = category },
                            color = if (selectedCategory == category)
                                MaterialTheme.colorScheme.primaryContainer
                            else
                                MaterialTheme.colorScheme.surfaceVariant,
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                RadioButton(
                                    selected = (selectedCategory == category),
                                    onClick = { selectedCategory = category }
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = category.displayName,
                                    fontWeight = if (selectedCategory == category) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }
            }

            // Nombre del cliente
            item {
                OutlinedTextField(
                    value = clientName,
                    onValueChange = { clientName = it },
                    label = { Text("Tu Nombre") },
                    placeholder = { Text("Ej. Juan Pérez") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )
            }

            // Formulario para escribir la descripción detallada
            item {
                OutlinedTextField(
                    value = description,
                    onValueChange = {
                        description = it
                        if (it.isNotBlank()) showError = false
                    },
                    label = { Text("Describe el problema detalladamente") },
                    placeholder = { Text("Explica qué sucede, mensajes de error o cuándo comenzó...") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp),
                    shape = RoundedCornerShape(12.dp),
                    isError = showError
                )
                if (showError) {
                    Text(
                        text = "Por favor describe el problema antes de enviar",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            // Botón "Enviar problema"
            item {
                Button(
                    onClick = {
                        if (description.isBlank()) {
                            showError = true
                        } else {
                            viewModel.submitTicket(
                                clientName = clientName,
                                category = selectedCategory,
                                description = description,
                                device = device
                            )
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Icon(Icons.Default.Send, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Enviar problema", fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
`
  },
  {
    name: 'TechnicianScreens.kt',
    path: 'app/src/main/java/com/soportetecnico/app/ui/TechnicianScreens.kt',
    description: 'Vistas del modo Técnico: lista de problemas, formulario de soluciones con pasos y actualización de estados.',
    code: `package com.soportetecnico.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.soportetecnico.app.model.*
import com.soportetecnico.app.viewmodel.AppScreen
import com.soportetecnico.app.viewmodel.SupportViewModel

/**
 * Modo Técnico: Lista de problemas reportados por clientes.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TechnicianListScreen(
    viewModel: SupportViewModel,
    onBack: () -> Unit,
    onSelectTicket: (String) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Panel del Técnico") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text(
                    text = "Problemas Reportados (" + viewModel.tickets.size + ")",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            items(viewModel.tickets) { ticket ->
                ElevatedCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSelectTicket(ticket.id) },
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            SuggestionChip(
                                onClick = {},
                                label = { Text(ticket.category.displayName) }
                            )
                            StatusBadge(ticket.status)
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = ticket.clientName,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = ticket.description,
                            style = MaterialTheme.typography.bodyMedium,
                            maxLines = 2
                        )
                    }
                }
            }
        }
    }
}

/**
 * Badge de Estado de Reporte: Pendiente / En diagnóstico / Solucionado
 */
@Composable
fun StatusBadge(status: TicketStatus) {
    val color = when (status) {
        TicketStatus.PENDIENTE -> Color(0xFFE65100)
        TicketStatus.EN_DIAGNOSTICO -> Color(0xFF0277BD)
        TicketStatus.SOLUCIONADO -> Color(0xFF2E7D32)
    }
    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(8.dp)
    ) {
        Text(
            text = status.displayName,
            color = color,
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
`
  }
];

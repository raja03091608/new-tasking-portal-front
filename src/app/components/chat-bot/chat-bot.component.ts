import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessages!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  isChatOpen = false;
  private escapeListener: any;

  constructor() { }

  ngOnInit() {
    // Add escape key listener
    this.escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isChatOpen) {
        this.toggleChat();
      }
    };
    document.addEventListener('keydown', this.escapeListener);
  }

  ngOnDestroy() {
    // Clean up the event listener
    document.removeEventListener('keydown', this.escapeListener);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      setTimeout(() => {
        this.messageInput.nativeElement.focus();
      });
    }
  }

  sendMessage() {
    if (this.currentMessage.trim() === '') return;

    // Add user message
    this.messages.push({
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    });

    // Clear input
    const userMessage = this.currentMessage;
    this.currentMessage = '';

    // Show typing indicator
    this.isTyping = true;

    // Simulate bot response after a delay
    setTimeout(() => {
      this.isTyping = false;
      this.messages.push({
        text: this.getBotResponse(userMessage),
        isUser: false,
        timestamp: new Date()
      });
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  clearChat() {
    this.messages = [];
  }

  private scrollToBottom() {
    try {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    } catch(err) { }
  }

  private getBotResponse(userMessage: string): string {
    // Simple response logic - can be expanded later
    const normalizedMessage = userMessage.toLowerCase();
    
    if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi')) {
      return 'Hello! How can I help you today?';
    } else if (normalizedMessage.includes('help')) {
      return 'I\'m here to help! What would you like to know?';
    } else if (normalizedMessage.includes('bye')) {
      return 'Goodbye! Have a great day!';
    } else {
      return 'I\'m still learning. Could you please rephrase that or ask something else?';
    }
  }
}

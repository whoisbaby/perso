module.exports = {
    data: {
        name: 'set',
        description: 'Change visual settings of the bot',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'name',
                description: 'Change the name of the bot',
                options: [
                    {
                        name: 'name',
                        type: 'STRING',
                        required: true,
                        description: 'The name to change'
                    }
                ]
            },
            {
                type: 'SUB_COMMAND',
                name: 'activity',
                description: 'Change the activity',
                options: [
                    {
                        type: 'STRING',
                        name: 'name',
                        description: 'The activity to change',
                        required: true
                    },
                    {
                        type: 'STRING',
                        name: 'type',
                        description: 'The type of activity',
                        required: true,
                        choices: [
                            {
                                name: 'watching',
                                value: 'watching',
                            },
                            {
                                name: 'playing',
                                value: 'playing',
                            },
                            {
                                name: 'streaming',
                                value: 'streaming',
                            },
                            {
                                name: 'listening',
                                value: 'listening',
                            },
                            {
                                name: 'competing',
                                value: 'competing'
                            },
                        ]
                    }
                ],
            },
            {
                name: 'status',
                description: 'Set the status of the bot',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'status',
                        description: 'The status to change',
                        required: true,
                        type: 'STRING',
                        choices: [
                            {
                                name: 'online',
                                value: 'online'
                            },
                            {
                                name: 'idle',
                                value: 'idle'
                            },
                            {
                                name: 'invisible',
                                value: 'invisible'
                            },
                            {
                                name: 'do not disturb',
                                value: 'dnd'
                            },
                        ]
                    }
                ]
            },
        ],
    },

    run: async (ftSecurity, interaction, memberData, guildData) => {
        if (!ftSecurity.isOwner(interaction.user.id)) return

        await interaction.deferReply({ephemeral: true})
        const {options} = interaction
        const subCommand = options.getSubcommand()
        const name = options.getString('name')
        if(name?.length > 128) return ftSecurity.functions.tempMessage(interaction, guildData.langManager.soutien.config.messageLength)

        if (subCommand === 'name') {
            ftSecurity.user.setUsername(name).then(() => {
                interaction.editReply({content: `Named successfully changed to ${name}`})
            }).catch(e => {
                interaction.editReply({content: e})
            })
        }
        if (subCommand === 'activity') {
            const type = options.get('type').value.toUpperCase()
            console.log(type)
            try {

                await ftSecurity.user.setPresence({
                    status: 'online',
                    activities: [{
                        name,
                        type,
                        url: 'https://www.twitch.tv/discord'
                    }]
                })
                await interaction.editReply({content: `Activity successfully changed to ${name}, ${type}`})

            } catch (e) {
                console.log(e)
                await interaction.editReply({content: e.toString()})
            }
        }
        if (subCommand === 'status') {
            const status = options.get('status').value
            try {
                ftSecurity.user.setPresence({status})
                await interaction.editReply({content: `Status successfully changed to ${status}`})

            } catch (e) {
                await interaction.editReply({content: e})
            }
        }
    }
}

import React from 'react';
import { Button, IconButton, Modal, ModalBody,
   ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure, Image, Text } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';


const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      {
        children ? (<span onClick={onOpen}>{children}</span>) :
        (
            <IconButton
                display={{base: 'flex'}}
                icon={<ViewIcon/>}
                onClick={onOpen}
            />
        )
      }

      <Modal isCentered size='lg' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h='410px'>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display='flex'
            flexDirection='column' 
            justifyContent='space-between' 
            alignItems='center' 

          >
              <Image 
                borderRadius='full'
                boxSize='150px'
                src={user.pic}
                alt={user.name}
              />
              <Text 
                fontFamily='Work sans'
                fontSize={{base:'28px', md: '30px'}}
              >
                Email: {user.email}
              </Text>
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal
